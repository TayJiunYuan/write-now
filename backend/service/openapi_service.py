from langchain.schema.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain.output_parsers.json import SimpleJsonOutputParser
from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain_core.messages import SystemMessage
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI


class OpenAIService:
    def __init__(self, OPEN_API_KEY):
        load_dotenv()
        self.OPEN_API_KEY = OPEN_API_KEY
        self.llm = ChatOpenAI(api_key=self.OPEN_API_KEY)
        self.output_parser = SimpleJsonOutputParser()
        self.system_message = (
            "You are a transcrition extractor. Extract the actions items from this transcript. "
            "Return a list of action items and meeting minutes of the meeting."
            "Ensure that the action items contain the action item and the person responsible for giving and the person responsible for receiving the action item."
            "Ensure that the meeting minutes is concise and only contains the main and most important points of the meeting."
            "Return in JSON format, where the first key is 'action_items' with a list of action items strings and the second key is 'meeting_minutes' with a list of meeting minutes strings."
            "If there are no action items, return an empty list for the action_items key."
            "If there are no meeting minutes, return an empty list for the meeting_minutes key."
            "This data will be displayed, so keep it concise and to the point."
        )

    def get_response(self, user_input):
        prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessage(
                    content=self.system_message
                ),  # The persistent system prompt
                HumanMessagePromptTemplate.from_template(
                    "{human_input}"
                ),  # Where the human input will injected
            ]
        )

        chat_llm_chain = LLMChain(
            llm=self.llm,
            prompt=prompt,
            verbose=True,
        )
        response = chat_llm_chain.predict(human_input=user_input)
        print(response)
        parsed_response = self.output_parser.parse(response)
        return parsed_response
