import React from 'react'
import Footer from '../../components/Footer/Footer'
import CurrencyAnalysis from '../../components/Modules/CurrencyAnalysis/CurrencyAnalysis'
import CurrencyPair from '../../components/Modules/CurrencyPair/CurrencyPair'


const Home = () => {
  return (
        <div className='flex flex-col h-[100vh] justify-between'>
            <div>
                <div className='mb-[50px]'>
                    <CurrencyPair/>
                </div>

                <div className='mb-[50px]'>
                    <CurrencyAnalysis/>
                </div>
            </div>


            <Footer/>

        </div>
    )
}

export default Home