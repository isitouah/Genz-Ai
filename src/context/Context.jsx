import { createContext, useState } from "react";
import run from "../Configs/gemini";


export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
                setResultData(prev => prev + nextWord);
        }, 80 * index)

    }

    const newChatBtn = () => {
        setLoading(false)
        setShowResult(false)
    }


    const onSent = async (prompt) => {
        //clearing previous result
        setResultData("")
        //display animation of screen loading
        setLoading(true)
        setShowResult(true)
        let resp;
        if (prompt !== undefined) {
             resp = await run(prompt)
             setRecentPrompt(prompt)
             setPrevPrompt(prev => [...prev, input])
             //console.log("else")

        } else {
             setRecentPrompt(input)
             resp = await run(input)   
        }
       


        let responseArray = resp.split("**")

        let newResponse = "";

        responseArray.forEach((res, index) => {
            if (index === 0 || index % 2 !== 1) {
                newResponse += res
            } else {
                newResponse += "<b>"+res+"</b>"
            }
        })

        let newResponseParagraph = newResponse.split("*").join("</br>")
        
        let newResponseArray = newResponseParagraph.split(" ")

        newResponseArray.forEach((words, index) => {
            delayPara(index, words+" ")
        })

        //setResultData(newResponseParagraph)
        setLoading(false)
        setInput("")
    }

   // onSent("what is react js")

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChatBtn
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export  default ContextProvider 

