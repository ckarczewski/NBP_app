import React from 'react'
import logo from './github.png'

const authors = [
    {
        name: "Justyna Owczarek",
        index: "229301",
        role: "Tester oraz Scrum Master"
    },{
        name: "Bartłomiej Ołubek",
        index: "229300",
        role: "Devops"
    },{
        name: "Robert Dudziński",
        index: "229248",
        role: "Frontend"
    },{
        name: "Cezary Karczewski",
        index: "229268",
        role: "Backend"
    },{
        name: "Artur Szydłowski",
        index: "229322",
        role: "Bazy danych"
    }
]

const Footer = () => {
  return (
    <>
        <div className='w-[100%] bg-slate-900 shadow-[0px_-5px_22px_-13px_rgba(66,68,90,1)] pt-[20px]'>
            <div className='text-white text-center flex sm:justify-evenly flex-col sm:flex-row items-center'>
                <div className='flex flex-col items-center'>
                    <a href="https://github.com/IIS-ZPI/ZPI2022_zaoczni_RzultePapaje"><img className='w-[65px]' src={logo} alt=""/></a> 
                    <div>GitHub.com</div>
                </div>
                <div className='sm:flex sm:flex-row sm:flex-a grid grid-cols-2 gap-[10px] max-sm:mt-[15px] w-[80%] sm:justify-around'>
                {
                    authors.map((item, index) => {
                        return(
                            <div key={index} className="text-slate-400 col-span-1 last:col-span-2">
                                <div className='sm:text-xl text-sm'>{item.name}</div>
                                <div className='sm:text-base text-sm'>{item.role}</div>
                                <div className='text-sm'>{item.index}</div>
                            </div>
                        )
                    })
                }
                </div>
            </div>
            
            <div className='w-[100%] bg-[#050713] text-center p-[10px] mt-[20px]'>
                <div className='text-slate-400'>
                    © Copyright 2023 - RzultePapaje sp. z.ł.o
                </div>
            </div>



            <div className='w-[100%] bg-[#050713] h-[5px]'>

            </div>
        </div>
    </>
  )
}

export default Footer