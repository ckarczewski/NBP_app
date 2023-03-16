import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import "chart.js/auto";
import { CurrencyAnalysisData } from '../../../util/CurrencyAnalysisData';
import { StatisticalMeasures } from '../../../util/StatisticalMeasures';
import Button from '../../Button/Button';
import CurrencyPicker from '../../CurrencyPicker/CurrencyPicker';
import Table from '../../StatisticalMeasuresTable/StatisticalMeasuresTable';
import Loader from '../../Loader/Loader';

const CurrencyAnalysis = () => {

    const [currencyCode, setCurrencyCode] = useState<string>("USD");
    const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>("USD");

    const [currencyAnalysisData, setCurrencyAnalysisData] = useState<CurrencyAnalysisData[]>([]);
    const [currencyData, setCurrencyData] = useState<number[]>([]);

    const [selectedTime, setSelectedTime] = useState<number>(0);

    const [tableData, setTableData] = useState<StatisticalMeasures[]>([]);

    const [isCurrencyDataLoading, setCurrencyDataLoading] = useState<boolean>(false);
    const [isTableDataLoading, setTableDataLoading] = useState<boolean>(false);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          },
        },
        scales:{
            y: {
              grid:{
                  display: false
              },
            },
            x: {
              grid:{
                  display: false
              }
            }       
        }
    }
    const labels = ['Spadek', 'Bez zmian', 'Wzrost'];
    const data = {
        labels,
        datasets: [
          {
            label: ``,
            data: currencyData,
            backgroundColor: ['#FA4E4E', '#4EB3FF', '#1DC14E'],
          }
        ],
    };

    const timePeriodName = ['Tydzień', '2 Tygodnie', 'Miesiąc', 'Kwartał', '6 Miesięcy', 'Rok']

    const renderTimePeriodButton = () => {
        return (
            <div className='min-w-[95%] overflow-auto overflow-y-hidden flex sm:justify-center'>
                {timePeriodName.map((item, index) => {
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
                            <div className={`font-medium text-xs sm:text-base ${selectedTime === index ? 'text-white' : 'text-blue-500'}`}>{item}</div> 
                        </button>
                    )
                })}
            </div>
        )
    }

    const changeSelectedTime = (value: number) => {
        setSelectedTime(value);
    }

    const changeCurrency = (currencyCode: string) => {
        setCurrencyCode(currencyCode);
    }

    const selectCurrency = () => {
        setSelectedCurrencyCode(currencyCode);
    }

    useEffect(() => {
        const currency = currencyAnalysisData[selectedTime];
        setCurrencyData(
            [
                currency?.count_down || 0, 
                currency?.count_const || 0, 
                currency?.count_up || 0
            ]);
    }, [currencyAnalysisData, selectedTime])

    useEffect(() => {
        const fetchData = async () => {
            setCurrencyDataLoading(true);
            setTableDataLoading(true);
            setTableData([]);

            try{
                const response = await axios.get<CurrencyAnalysisData[]>(`${process.env.REACT_APP_API_ROOT}/session?currency=${selectedCurrencyCode}`);
                setCurrencyAnalysisData(response.data);
                setCurrencyDataLoading(false);
            } catch(err){
                console.error(err);
            }

            try{
                const response = await axios.get<StatisticalMeasures[]>(`${process.env.REACT_APP_API_ROOT}/measures?currency=${selectedCurrencyCode}`);
                setTableData(response.data);
                setTableDataLoading(false);
            } catch(err){
                console.error(err);
            }
        }
    
        fetchData();
      }, [selectedCurrencyCode]);

    return (
        <>
            <div className='flex items-center my-[50px]'>
                <div className='w-[100%] h-[2px] bg-gradient-to-r from-[#F2F3F4] to-gray-400 ml-[50px] mr-[10px]'></div>
                <span className='text-2xl w-[500px] text-center text-gray-600'>Analiza waluty</span>
                <div className='w-[100%] h-[2px] bg-gradient-to-l from-[#F2F3F4] to-gray-400 mr-[50px] ml-[10px]'></div>
            </div>

            <div className='grid lg:grid-cols-3 grid-cols-1 mt-[40px]'>
                <div className='lg:col-span-2 col-span-1 lg:row-start-1 row-start-0 sm:mx-[40px] mx-[10px] h-[550px] bg-white p-[10px] pb-[80px] rounded-lg shadow'>
                        <div className='flex justify-center mb-[20px] mt-[10px]'>
                            {renderTimePeriodButton()}
                        </div>
                    <Loader isLoading={isCurrencyDataLoading}>
                        <Bar options={options} data={data}/>
                    </Loader>
                </div>
                <div className='flex justify-center row-start-1 lg:row-start-0  mb-[30px]'>
                    <div className='bg-white w-[85%] max-h-[200px] p-[10px] pb-[20px] rounded-lg shadow flex  flex-col items-center'>
                        <div className='mb-[10px] text-lg font-medium'>Wybierz walutę</div>
                        <div className='flex justify-center lg:flex-col sm:flex-row flex-col items-center'>
                            <CurrencyPicker countryCode={currencyCode} onChange={(c) => changeCurrency(c)}/>
                        </div>
                        <Button text='Sprawdź' onClick={selectCurrency}/>
                    </div>
                </div>
            </div>

            <Table data={tableData} isLoading={isTableDataLoading}/>
        </>
    )
}

export default CurrencyAnalysis