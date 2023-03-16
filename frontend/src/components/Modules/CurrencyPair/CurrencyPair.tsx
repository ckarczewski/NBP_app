import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import "chart.js/auto";
import Button from '../../Button/Button'
import CurrencyPicker from '../../CurrencyPicker/CurrencyPicker'
import axios from 'axios';
import { CurrencyPairData } from '../../../util/CurrencyPairData';
import Loader from '../../Loader/Loader';

const CurrencyPair = () => {
    const [currencyPair, setCurrencyPair] = useState<string[]>(["USD", "GBP"]);
    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState<string[]>(["USD", "GBP"]);
    const [labelName, setLabelName] = useState<string>("");

    const [labels, setLabels] = useState<string[][]>([]);
    const [datasets, setDatasets] = useState<number[][]>([]);

    const [selectedTime, setSelectedTime] = useState<number>(0);

    const [isLoading, setLoading] = useState<boolean>(false);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: ({raw}: any) => `${raw}%`
            }
          }
        },
        scales:{
            y: {
              grid:{
                  display: false
              },
              ticks: {
                callback: (value: any) => `${value}%`
              }
            },
            x: {
              grid:{
                  display: false
              }
            }       
        },
    }

    const data = {
        labels: labels[selectedTime],
        datasets: [
          {
            label: labelName,
            data: datasets[selectedTime],
            backgroundColor: 'rgba(0, 129, 251, 0.8)',
          }
        ],
    };

    const changeCurrency = (currencyCode: string, index: number) => {
        const newCurrencyPair = [...currencyPair];
        newCurrencyPair[index] = currencyCode;
        setCurrencyPair(newCurrencyPair);
    }

    const changeSelectedTime = (value: number) => {
        setSelectedTime(value);
    }

    const timePeriodName = ['Miesiąc', 'Kwartał']

    const renderTimePeriodButton = () => {
        return (
            timePeriodName.map((item, index) => {
                return (
                    <button 
                        className={`border-[2px] border-blue-500 sm:p-[5px] py-[5px] px-[1px] max-sm:text-sm min-w-[75px] 
                                    ${index === 0 ? 'rounded-l-lg' : 'border-l-0'}
                                    ${index ===  timePeriodName.length - 1? 'rounded-r-lg' : ''}
                                    ${selectedTime === index ? 'bg-blue-500' : ''}
                                    `}
                        onClick={() => changeSelectedTime(index)}
                        key={index}
                        >
                        <div className={`font-medium ${selectedTime === index ? 'text-white' : 'text-blue-500'}`}>{item}</div> 
                    </button>
                )
            })
        )
    }

    const selectCurrency = () => {
        setSelectedCurrencyPair(currencyPair);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const response = await axios.get<CurrencyPairData[][]>(`${process.env.REACT_APP_API_ROOT}/currency_comparison?currency_one=${selectedCurrencyPair[0]}&currency_two=${selectedCurrencyPair[1]}`);
                setLabelName(`${selectedCurrencyPair[0]}/${selectedCurrencyPair[1]}`);
                const newLabels = []
                const newDatasets = []

                for(let timeRange of response.data){
                    const labels = []
                    const data = []
                    for(let item of timeRange){
                        labels.push(item.scope)
                        data.push(item.value);
                    }

                    newLabels.push(labels);
                    newDatasets.push(data);
                }

                setLabels(newLabels);
                setDatasets(newDatasets);
                setLoading(false);

            } catch(err){
                console.error(err);
            }
        }

        fetchData();
    }, [selectedCurrencyPair])

    return (
        <>
            <div className='flex items-center my-[50px]'>
                <div className='w-[100%] h-[2px] bg-gradient-to-r from-[#F2F3F4] to-gray-400 ml-[50px] mr-[10px]'></div>
                <span className='text-2xl w-[500px] text-center text-gray-600'>Analiza par walut</span>
                <div className='w-[100%] h-[2px] bg-gradient-to-l from-[#F2F3F4] to-gray-400 mr-[50px] ml-[10px]'></div>

            </div>
            <div className='grid lg:grid-cols-3 grid-cols-1 mt-[40px]'>
                <div className='lg:col-span-2 col-span-1 lg:row-start-1 row-start-0 sm:mx-[40px] mx-[10px] h-[500px] bg-white p-[10px] pb-[100px] rounded-lg shadow'>
                    <div className='flex justify-center mb-[20px] mt-[10px]'>
                        {renderTimePeriodButton()}
                    </div>

                    <Loader isLoading={isLoading}>
                        <Bar options={options} data={data}/>
                    </Loader>
                </div>
                <div className='flex justify-center row-start-1 lg:row-start-0 mb-[30px]'>
                    <div className='bg-white w-[85%] max-h-[300px] p-[10px] pb-[20px] rounded-lg shadow flex  flex-col items-center'>
                        <div className='mb-[10px] text-lg font-medium'>Wybierz waluty</div>
                        <div className='flex justify-center lg:flex-col sm:flex-row flex-col items-center'>
                            <CurrencyPicker countryCode={currencyPair[0]} onChange={(c) => changeCurrency(c, 0)}/>
                            <div className='text-sm m-[5px] text-slate-600 italic'>-oraz-</div>
                            <CurrencyPicker countryCode={currencyPair[1]} onChange={(c) => changeCurrency(c, 1)}/>
                        </div>
                        <Button text='Sprawdź' onClick={selectCurrency}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CurrencyPair