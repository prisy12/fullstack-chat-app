import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import AIChatbot from './AIChatbot'



const ChatContainer = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
    const { onlineUsers, authUser } = useContext(AuthContext)
    const scrollEnd = useRef()

    const [input, setInput] = useState('')

    // handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return null;
        await sendMessage({ text: input.trim() });
        setInput("")
    }

    //Handle sending an image
    // const handleSendImage = async (e) =>{
    //     const file = e.target.files[0];
    //     if(!file || !file.type.startsWith("image/")){
    //         toast.error("select an image file")
    //         return;
    //     }
    //     const reader = new FileReader();

    //     reader.onloadend = async () => {
    //         await sendMessage({image: reader.result})
    //         e.target.value = ""
    //     }
    //     reader.readAsDataURL(file)
    // }

    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Chatter"); // 🔁 Replace this
        formData.append("cloud_name", "dogiloutw"); // 🔁 Replace this

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dogiloutw/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            const imageUrl = data.secure_url;

            // ✅ Send to backend as URL, not base64
            await sendMessage({ image: imageUrl });
            e.target.value = "";
        } catch (err) {
            console.error("Image upload failed", err);
            toast.error("Image upload failed");
        }
    };


    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
        }
    }, [selectedUser])

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    return selectedUser ? (
        selectedUser.isAI ? (
            <AIChatbot />
        ) : (
            <div className='h-full overflow-scroll relative backdrop-blur-lg'>
                {/* ----header--- */}
                <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                    <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
                    <p className='flex-1 text-lg text-white flex items-center gap-2'>
                        {selectedUser.fullName}
                        {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                    </p>
                    <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
                    {/* <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' /> */}
                </div>
                {/* ---chat area--- */}
                <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 justify-end 
                    ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                            {
                                msg.image ? (
                                    <img src={msg.image} alt="" className='max-w-[230px] border 
                        border-gray-700 rounded-lg overflow-hidden mb-8'/>
                                ) : (
                                    <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8
                                break-all bg-violet-500/30 text-white 
                                ${msg.senderId !== authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                        {msg.text}</p>
                                )
                            }
                            <div className="text-center text-xs">
                                <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                                    className="w-7 rounded-full" alt="" />
                                <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollEnd}></div>
                </div>
                {/*------bottom area---------*/}
                {/* <div className='bottom-0 left-0 right-0 flex items-center gap-3 p-3 '>
                <div className='relative flex-1 flex items-center br-gray-100/12 px-3 rounded-full'>
                    <input type="text" placeholder='Send a message' className='relative flex-1 text-sm py-2 px-4 bg-white/10 border-none
                    outline-none text-white placeholder-gray-400 rounded-full' />
                    <input type="file" id="image" accept='image/png, image/jpeg' hidden />
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} className='absolute w-5 mr-2 cursor-pointer' alt="" />
                    </label>

                </div>
                <img src={assets.send_button} className='w-7 cursor-pointer' alt="" />
            </div> */}
                <div className='bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                    <div className='relative flex-1'>
                        {/* Text input with padding on the right for the icon */}
                        <input onChange={(e) => setInput(e.target.value)} value={input}
                            onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
                            type="text"
                            placeholder="Send a message"
                            className="w-full text-sm py-2 pl-4 pr-10 bg-white/10 text-white placeholder-gray-400 rounded-full outline-none"
                        />

                        {/* Hidden file input */}
                        <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />

                        {/* Label with absolute positioning inside the input */}
                        <label htmlFor="image" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                            <img src={assets.gallery_icon} className="w-5" alt="Upload" />
                        </label>
                    </div>

                    <img onClick={handleSendMessage} src={assets.send_button} className='w-7 cursor-pointer' alt="Send" />
                </div>

            </div>
        )
    ) : (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 by-white/10 max-md:hidden'>
            <img src={assets.logo_icon} className='max-w-16' alt="" />
            <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
        </div>
    )
}

export default ChatContainer