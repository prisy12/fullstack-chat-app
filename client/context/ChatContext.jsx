import { Children, createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";
// import { toast } from "react-hot-toast";


export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    //function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    //function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send messages to selected user
    const sendMessage = async ({ text, image }) => {
        if (!selectedUser) return;

        // Check if selected user is AI Chatbot
        if (selectedUser.isAI && selectedUser._id === "ai_chatbot") {
            try {
                const userMessage = {
                    senderId: "you",
                    text,
                    image,
                    createdAt: new Date()
                };
                setMessages((prev) => [...prev, userMessage]);

                const { data } = await axios.post('/api/aiChat', { message: text });

                const aiMessage = {
                    senderId: "ai_chatbot",
                    text: data.reply, // Assuming your AI returns { reply: "..." }
                    createdAt: new Date()
                };

                setMessages((prev) => [...prev, aiMessage]);
            } catch (error) {
                console.error("AI Chatbot error:", error);
            }

            return;
        }

        // Normal user-to-user message
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, { text, image });
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // const sendMessage = async (messageData) => {
    //     try {
    //         const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
    //         if(data.success){
    //             setMessages((prevMessages)=> [...prevMessages, data.newMessage])
    //         }
    //         else{
    //             toast.error(data.message);
    //         } 
    //      } catch (error) {
    //         toast.error(error.message)
    //     }
    // }


    //functiont to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seenm = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    //function to unscribe from messages
    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");

    }
    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser,
        unseenMessages, setUnseenMessages
    }

    return (<ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
    )
}
