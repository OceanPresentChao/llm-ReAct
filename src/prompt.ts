export const REACT_PROMPT = `Answer the following questions or complete the task as best you can. You have access to the following tools
name | description | params
{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the correct input according to the params of used Action Tool to the action. format: json object schema
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: Output "I now know the final answer" if you solve the problem or "I have done the task" if you done the task
Final Answer: the final answer to the original input question

Begin! Let's think step by step!

Question: {input}
Thought:{agent_scratchpad}`
