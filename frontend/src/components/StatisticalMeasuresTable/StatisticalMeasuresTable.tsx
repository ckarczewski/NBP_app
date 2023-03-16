import React from 'react'
import { StatisticalMeasures } from '../../util/StatisticalMeasures'
import Loader from '../Loader/Loader';

interface props {
    data: StatisticalMeasures[],
    isLoading?: boolean
}

const StatisticalMeasuresTable = ({data, isLoading}: props) => {
    const columnNames = ['Tydzień', '2 Tygodnie', 'Miesiąc', 'Kwartał', '6 Miesięcy', 'Rok'];

    const renderTable = () => {
        return (
            <div className='relative overflow-auto'>
                <table className='min-w-[800px] w-[100%]'>
                    <thead>
                        <tr>
                            <th className='w-[200px]'></th>
                            {columnNames.map((item, index) => {
                                return(
                                    <th key={index} className='text-lg'>{item}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='font-bold'>Mediana</td>
                            {columnNames.map((item, index) => {
                                return (
                                    <td className='text-center' key={index}>{data[index].median}</td>
                                )
                            })}
                        </tr>

                        <tr>
                            <td className='font-bold'>Dominanta</td>
                            {columnNames.map((item, index) => {
                                return (
                                    <td className='text-center' key={index}>{data[index].dominant.join(' ')}</td>
                                )
                            })}
                        </tr>

                        <tr>
                            <td className='font-bold'>Odchylenie standardowe</td>
                            {columnNames.map((item, index) => {
                                return (
                                    <td className='text-center' key={index}>{data[index].standard_deviation}</td>
                                )
                            })}
                        </tr>

                        <tr>
                            <td className='font-bold'>Współczynnik zmienności</td>
                            {columnNames.map((item, index) => {
                                return (
                                    <td className='text-center' key={index}>{data[index].coefficient_of_variation ? `${data[index].coefficient_of_variation}%` : "-"}</td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className='sm:mx-[40px] mx-[10px] p-[20px] rounded-lg shadow bg-white mt-[20px]'>
            <Loader isLoading={isLoading}>
                {(data.length > 0)? renderTable() : ""}
            </Loader>
        </div>
    )
}

export default StatisticalMeasuresTable