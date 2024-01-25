export const REACT_PROMPT = `Answer the following questions as best you can. You have access to the following tools
name | description | typescript func declaration
{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the correct input according to the func declaration of used Action Tool to the action. format: json array schema
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}`
