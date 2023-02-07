import SvgIconUtil from "@coremedia/studio-client.base-models/util/SvgIconUtil";
import icon from "./icons/openai.svg";

/**
 * Interface values for ResourceBundle "FeedbackHubOpenAIStudioPlugin".
 */
interface FeedbackHubOpenAIStudioPlugin_properties {

/**
 * General
 *#######################################################################################################################
 */
  OpenAI_iconCls: string;
  OpenAI_title: string;
  OpenAI_tooltip: string;
  OpenAI_ariaLabel: string;
  OpenAI_general_tab_title: string;
  /**
   * Custom UI
   *#######################################################################################################################
   */

  OpenAI_instruction_emptyText: string;
  OpenAI_instruction_blank_validation_text: string;
  OpenAI_instruction_submit_button_label: string;
  OpenAI_apply_text_button_label: string;
  OpenAI_apply_text_popup_message: string;
  OpenAI_apply_text_popup_submit_button_label: string;
  OpenAI_default_state_title: string;
  OpenAI_default_state_text: string;
  OpenAI_empty_state_title: string;
  OpenAI_empty_state_text: string;
  OpenAI_loading_state_title: string;
  OpenAI_loading_state_text: string;
  OpenAI_credit_link: string;
  OpenAI_settings_title: string;
  OpenAI_settings_temperature_fieldLabel: string;
  OpenAI_settings_temperature_tooltip: string;
  OpenAI_settings_maxLength_fieldLabel: string;
  OpenAI_settings_maxLength_tooltip: string;
}

/**
 * Singleton for the current user Locale's instance of ResourceBundle "FeedbackHubOpenAIStudioPlugin".
 * @see FeedbackHubOpenAIStudioPlugin_properties
 */
const FeedbackHubOpenAIStudioPlugin_properties: FeedbackHubOpenAIStudioPlugin_properties = {
  OpenAI_iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(icon),
  OpenAI_title: "OpenAI",
  OpenAI_tooltip: "AI driven text generation",
  OpenAI_ariaLabel: "ChatGPT",
  OpenAI_general_tab_title: "ChatGPT",
  OpenAI_instruction_emptyText: "Enter a question or idea to generate text based on AI",
  OpenAI_instruction_blank_validation_text: "This field is required",
  OpenAI_instruction_submit_button_label: "Submit",
  OpenAI_apply_text_button_label: "Apply Text to Content",
  OpenAI_apply_text_popup_message: "This will override the existing Article Text.",
  OpenAI_apply_text_popup_submit_button_label: "Confirm",
  OpenAI_default_state_title: "ChatGPT",
  OpenAI_default_state_text: "Create content quickly and easily with ChatGPT. Start with an idea or question and we do the rest.",
  OpenAI_empty_state_title: "No result",
  OpenAI_empty_state_text: "OpenAI was not able to generate a result. Please rephrase your question and try again.",
  OpenAI_loading_state_title: "Writing ...",
  OpenAI_loading_state_text: "Please have some patience while ChatGPT generates the text.",
  OpenAI_credit_link: "service provided by <a href=\"https://openai.com/\" target=\"_blank\">OpenAI</a>.",
  OpenAI_settings_title: "AI Model Configuration",
  OpenAI_settings_temperature_fieldLabel: "Temperature",
  OpenAI_settings_temperature_tooltip: "Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.",
  OpenAI_settings_maxLength_fieldLabel: "Maximum length",
  OpenAI_settings_maxLength_tooltip: "The maximum length of tokens to generate."
};

export default FeedbackHubOpenAIStudioPlugin_properties;
