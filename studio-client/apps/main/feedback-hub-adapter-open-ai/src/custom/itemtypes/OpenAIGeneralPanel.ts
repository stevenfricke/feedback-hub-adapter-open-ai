import GenericRemoteJob from "@coremedia/studio-client.cap-rest-client-impl/common/impl/GenericRemoteJob";
import JobExecutionError from "@coremedia/studio-client.cap-rest-client/common/JobExecutionError";
import jobService from "@coremedia/studio-client.cap-rest-client/common/jobService";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import VerticalSpacingPlugin from "@coremedia/studio-client.ext.ui-components/plugins/VerticalSpacingPlugin";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import DisplayFieldSkin from "@coremedia/studio-client.ext.ui-components/skins/DisplayFieldSkin";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import FeedbackItemPanel
  from "@coremedia/studio-client.main.feedback-hub-editor-components/components/itempanels/FeedbackItemPanel";
import Component from "@jangaroo/ext-ts/Component";
import Button from "@jangaroo/ext-ts/button/Button";
import Container from "@jangaroo/ext-ts/container/Container";
import FormPanel from "@jangaroo/ext-ts/form/Panel";
import DisplayField from "@jangaroo/ext-ts/form/field/Display";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import AnchorLayout from "@jangaroo/ext-ts/layout/container/Anchor";
import HBoxLayout from "@jangaroo/ext-ts/layout/container/HBox";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import {bind} from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import trace from "@jangaroo/runtime/trace";
import FeedbackHubOpenAIStudioPlugin_properties from "../../FeedbackHubOpenAIStudioPlugin_properties";
import MessageBoxUtil from "@coremedia/studio-client.ext.ui-components/messagebox/MessageBoxUtil";
import BaseField from "@jangaroo/ext-ts/form/field/Base";
import ExtEvent from "@jangaroo/ext-ts/event/Event";
import EmptyContainer from "@coremedia/studio-client.ext.ui-components/components/EmptyContainer";
import ContainerSkin from "@coremedia/studio-client.ext.ui-components/skins/ContainerSkin";
import SwitchingContainer from "@coremedia/studio-client.ext.ui-components/components/SwitchingContainer";
import TextArea from "@jangaroo/ext-ts/form/field/TextArea";

interface OpenAIGeneralPanelConfig extends Config<FeedbackItemPanel> {
}

class OpenAIGeneralPanel extends FeedbackItemPanel {
  declare Config: OpenAIGeneralPanelConfig;

  static readonly CONFIDENCE_BAR_ITEM_ID: string = "confidenceBar";
  static readonly RESPONSE_CONTAINER_ITEM_ID: string = "responseContainer";

  #generatedTextExpression: ValueExpression = null;

  #questionInputExpression: ValueExpression = null;

  #activeStateExpression: ValueExpression = null;

  static readonly DEFAULT_STATE: string = "default";
  static readonly EMPTY_STATE: string = "empty";
  static readonly LOADING_STATE: string = "loading";
  static readonly SUCCESS_STATE: string = "success";

  static readonly BLOCK_CLASS_NAME: string = "OpenAI-general-panel";

  //dirty
  static override readonly xtype: string = "com.coremedia.labs.plugins.feedbackhub.wonki.config.OpenAIitempanel";

  constructor(config: Config<OpenAIGeneralPanel> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(OpenAIGeneralPanel, {
      cls: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
      items: [
        // Input fields
        Config(FormPanel, {
          items: [
            Config(TextField, {
              flex: 1,
              fieldLabel: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_question_label,
              allowBlank: false,
              blankText: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_question_blank_validation_text,
              emptyText: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_question_emptyText,
              plugins: [
                Config(BindPropertyPlugin, {
                  bindTo: this$.getQuestionInputExpression(),
                  bidirectional: true,
                }),
              ],
              listeners: {
                "specialkey": (field: BaseField, e: ExtEvent) => {
                  if (e.getKey() === ExtEvent.ENTER) {
                    this.applyQuestion();
                  }
                }
              },
            }),
            Config(Container, {width: 6}),
            Config(Button, {
              formBind: true,
              ui: ButtonSkin.MATERIAL_PRIMARY.getSkin(),
              handler: bind(this$, this$.applyQuestion),
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_question_submit_button_label,
            }),
          ],
          layout: Config(HBoxLayout, {
            align: "stretch",
            pack: "start",
          }),
        }),

        // Results
        Config(SwitchingContainer, {
          itemId: OpenAIGeneralPanel.RESPONSE_CONTAINER_ITEM_ID,
          activeItemValueExpression: this$.getActiveStateExpression(),
          minHeight: 100,
          items: [
            Config(EmptyContainer, {
              itemId: OpenAIGeneralPanel.DEFAULT_STATE,
              iconElementName: "default-state-icon",
              bemBlockName: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_default_state_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_default_state_text,
            }),
            Config(EmptyContainer, {
              itemId: OpenAIGeneralPanel.EMPTY_STATE,
              iconElementName: "empty-state-icon",
              bemBlockName: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_empty_state_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_empty_state_text,
            }),
            Config(EmptyContainer, {
              itemId: OpenAIGeneralPanel.LOADING_STATE,
              iconElementName: "loading-state-icon",
              bemBlockName: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_loading_state_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_loading_state_text,
            }),
            Config(Container, {
              itemId: OpenAIGeneralPanel.SUCCESS_STATE,
              items: [
                Config(DisplayField, {
                  ui: DisplayFieldSkin.BOLD.getSkin(),
                  value: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_generated_text_header,
                }),
                Config(TextArea, {
                  autoScroll: true,
                  readOnly: true,
                  flex: 1,
                  minHeight: 300,
                  plugins: [
                    Config(BindPropertyPlugin, {
                      bindTo: this$.getGeneratedTextExpression(),
                    }),
                  ],
                }),
                Config(Container, {height: 6}),
                Config(Button, {
                  formBind: true,
                  ui: ButtonSkin.VIVID.getSkin(),
                  handler: bind(this$, this$.applyTextToContent),
                  text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_button_label,
                }),
              ],
              layout: Config(VBoxLayout, {align: "stretch"}),
            }),
          ]
        }),
        Config(DisplayField, {
          cls: `${OpenAIGeneralPanel.BLOCK_CLASS_NAME}__credit_link`,
          value: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_credit_link,
          htmlEncode: false
        })
      ],
      defaultType: Component.xtype,
      defaults: Config<Component>({anchor: "100%"}),
      layout: Config(AnchorLayout),
      plugins: [
        Config(VerticalSpacingPlugin),
      ],
    }), config));
  }

  getQuestionInputExpression(): ValueExpression {
    if (!this.#questionInputExpression) {
      this.#questionInputExpression = ValueExpressionFactory.createFromValue("");
    }
    return this.#questionInputExpression;
  }

  getGeneratedTextExpression(): ValueExpression {
    if (!this.#generatedTextExpression) {
      this.#generatedTextExpression = ValueExpressionFactory.createFromValue("");
    }
    return this.#generatedTextExpression;
  }

  getActiveStateExpression(): ValueExpression {
    if (!this.#activeStateExpression) {
      this.#activeStateExpression = ValueExpressionFactory.createFromValue(OpenAIGeneralPanel.DEFAULT_STATE);
    }
    return this.#activeStateExpression;
  }

  applyTextToContent(b: Button): void {
    let title = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_button_label;
    let msg = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_popup_message;
    let buttonLabel = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_popup_submit_button_label;
    MessageBoxUtil.showConfirmation(title, msg, buttonLabel,
            (btn: any): void => {
              if (btn === "ok") {
                const content: Content = this.contentExpression.getValue();
                const text = this.getGeneratedTextExpression().getValue();
                const params: Record<string, any> = {
                  text: text,
                  contentId: content.getId(),
                };

                const JOB_TYPE = "ApplyTextToContent";
                console.log(`request params: ${params}`);
                jobService._.executeJob(
                        new GenericRemoteJob(JOB_TYPE, params),
                        //on success
                        (details: any): void => {
                        },
                        //on error
                        (error: JobExecutionError): void => {
                          trace("[ERROR]", "Error applying text to content: " + error);
                        },
                );
              }
            });
  }

  applyQuestion(): void {
    const content: Content = this.contentExpression.getValue();
    let siteId = editorContext._.getSitesService().getSiteIdFor(content);
    if (!siteId) {
      siteId = "all";
    }
    const input = this.getQuestionInputExpression().getValue();
    const params: Record<string, any> = {
      prompt: input,
      contentId: content.getId(),
      siteId: siteId,
      groupId: this.feedbackGroup.name,
    };

    const JOB_TYPE = "generateText";
    console.log(`request params: ${params}`);

    jobService._.executeJob(
            new GenericRemoteJob(JOB_TYPE, params),
            //on success
            (details: any): void => {

              this.getActiveStateExpression().setValue(OpenAIGeneralPanel.SUCCESS_STATE);
              this.getGeneratedTextExpression().setValue(details);


            },
            //on error
            (error: JobExecutionError): void => {
              this.getActiveStateExpression().setValue(OpenAIGeneralPanel.EMPTY_STATE);
              trace("[ERROR]", "Error applying question: " + error);
            },
    );

    this.getActiveStateExpression().setValue(OpenAIGeneralPanel.LOADING_STATE);
  }

}

export default OpenAIGeneralPanel;
