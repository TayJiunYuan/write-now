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
from models.user import User


class MeetingAnalysisAIService:
    def __init__(self, OPEN_API_KEY):
        load_dotenv()
        self.OPEN_API_KEY = OPEN_API_KEY
        self.llm = ChatOpenAI(api_key=self.OPEN_API_KEY)
        self.output_parser = SimpleJsonOutputParser()
        self.system_message = (
            "You are a transcrition extractor. Extract the actions items from this transcript. "
            "Return a list of action items and meeting minutes of the meeting."
            "Ensure that the action items contain the action item and the person responsible for receiving the action item."
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


class TaskCreationAIService:
    def __init__(self, OPEN_API_KEY):
        load_dotenv()
        self.OPEN_API_KEY = OPEN_API_KEY
        self.llm = ChatOpenAI(api_key=self.OPEN_API_KEY)
        self.output_parser = SimpleJsonOutputParser()
        self.system_message = (
            "You are a task creator. Return task name, task description based on the action item that is given to you later"
            "The return format is a JSON object with the following keys: name (of task), description (of task)"
            "The task_name is the name of the task"
            "The task_description is the description of the task"
            "If any of the fields is not found or not clear, return an empty string for that field"
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


class ShortEmailSummaryAIService:
    def __init__(self, OPEN_API_KEY):
        load_dotenv()
        self.OPEN_API_KEY = OPEN_API_KEY
        self.llm = ChatOpenAI(api_key=self.OPEN_API_KEY)
        self.system_message = (
            "You are a short email summary creator. Return a super short summary of the email that is given to you later"
            "The return format is a string. Ensure that the summary is concise and to the point and at most 2 sentences"
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
        return response
    

class LongEmailSummaryAIService:
    def __init__(self, OPEN_API_KEY):
        load_dotenv()
        self.OPEN_API_KEY = OPEN_API_KEY
        self.llm = ChatOpenAI(api_key=self.OPEN_API_KEY)
        self.system_message = (
            "You are a email summary creator. Return a summary of the email that is given to you later"
            "The return format is a string. Ensure that the summary is concise and to the point"
            "You might be given a thread of emails, so ensure that you return a summary of the entire thread"
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
        return response
