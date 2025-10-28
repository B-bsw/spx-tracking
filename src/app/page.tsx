'use client'
import Image from 'next/image'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { timeStamp } from 'node:console'
import {
    IconHomeDot,
    IconLocation,
    IconLocationUp,
    IconPhoneCalling,
    IconPoint,
    IconSearch,
    IconTimelineEventText,
} from '@tabler/icons-react'

type Data = {
    fulfillment_info: {
        deliver_type: number
    }
    is_instant_order: boolean
    sls_tracking_info: {
        sls_tn: string
        client_order_id: string
        receiver_name: string
        records: {
            actual_time: number
            status: string
            description: string
            buyer_description: string
            tracking_code: string
            current_location: {
                full_address: string
                lat: string
                lng: string
            }
            next_location: {
                full_address: string
                lat: string
                lng: string
                location_name: string
            }
            operator_phone: string
        }[]
    }
}

export default function Page() {
    const [txtInput, setTxtInput] = useState<string | null>(null)
    const [txt, setTxt] = useState<Data | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        axios
            .get('/api')
            .then((res) => {
                setTxt(res.data.data)
                setLoading(false)
            })
            .catch(console.error)
    }, [])

    const handleChangeTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTxtInput(event.target.value.toUpperCase())
    }

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!txtInput?.length) {
            setTxt(null)
            return
        }
        setLoading(true)
        axios
            .get(`/api?spx_tn=${txtInput}`)
            .then((res) => {
                setTxt(res.data.data)
                setLoading(false)
            })
            .catch(console.error)
    }

    const handleSearchClick = async (
        event: React.MouseEvent<HTMLInputElement>
    ) => {
        if (!txtInput?.length) {
            setTxt(null)
            return
        }
        setLoading(true)
        axios
            .get(`/api?spx_tn=${txtInput}`)
            .then((res) => {
                setTxt(res.data.data)
                setLoading(false)
            })
            .catch(console.error)
    }

    const changeTimeToTime = (timeStamp: number) => {
        const date = new Date(timeStamp * 1000)

        const time = date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
        return time
    }

    const changeTimeToDate = (timeStamp: number) => {
        const date = new Date(timeStamp * 1000)

        const dates = date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })

        return dates
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-5">
            {loading && (
                <div className="absolute flex h-screen w-screen flex-col items-center justify-center bg-white opacity-40">
                    <div className="animate-pulse text-2xl select-none">
                        Loading...
                    </div>
                </div>
            )}
            <div className="grid h-full max-w-6xl grid-cols-1 gap-4 px-4">
                <div className="my-6 w-full">
                    <form onSubmit={handleSearch}>
                        <div className="flex items-center justify-center gap-2 rounded-2xl p-6 shadow-md max-sm:flex-col">
                            <div className="w-fit font-medium text-nowrap select-none max-sm:text-xl">
                                กรอกเลขพัสดุ
                            </div>
                            <div className="flex gap-2 w-full">
                                <input
                                    type="text"
                                    onChange={handleChangeTxt}
                                    className="w-full rounded-sm p-1 outline-2 outline-zinc-200 focus:outline-zinc-500"
                                />
                                <div
                                    className="cursor-pointer rounded-md bg-zinc-100 p-1.5 transition-all duration-300 hover:bg-zinc-200 active:scale-90"
                                    onClick={handleSearchClick}
                                >
                                    <IconSearch />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {txt?.sls_tracking_info.records ? (
                    txt.sls_tracking_info.records.map((items, index) => (
                        <div
                            className="flex gap-4 divide-x-2 divide-zinc-300 rounded-2xl p-4 shadow-md max-md:flex-col max-md:divide-none"
                            key={index}
                        >
                            <div className="flex items-center justify-center p-2 font-medium text-nowrap max-md:w-fit max-md:items-start max-md:gap-5 md:flex-col">
                                <IconTimelineEventText className="text-zinc-500" />
                                <div>{changeTimeToTime(items.actual_time)}</div>
                                <div>{changeTimeToDate(items.actual_time)}</div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-2 max-md:flex-col">
                                    <div className="flex gap-2 font-bold">
                                        <IconPoint className="" />
                                        Status:
                                    </div>{' '}
                                    {items.buyer_description}
                                </div>

                                {items.operator_phone && (
                                    <div className="flex items-start gap-2 max-md:flex-col">
                                        <div className="flex gap-2 font-bold">
                                            <IconPhoneCalling />
                                            Driver Phone:{' '}
                                        </div>
                                        <div className="font-normal">
                                            {items.operator_phone}
                                        </div>
                                    </div>
                                )}

                                {items.current_location.full_address && (
                                    <div className="flex items-start gap-2 max-md:flex-col">
                                        <div className="flex gap-2 font-bold">
                                            <IconHomeDot className="" />
                                            Address:
                                        </div>{' '}
                                        {items.current_location.full_address}
                                    </div>
                                )}

                                {items.current_location.lat.length > 0 && (
                                    <div className="flex items-center gap-2 max-md:flex-col max-md:items-start">
                                        <div>
                                            <IconLocation />
                                        </div>
                                        <Link
                                            className="inline-block rounded-md bg-zinc-100 p-1"
                                            target="_blank"
                                            href={`https://www.google.com/maps/search/?api=1&query=${
                                                items.current_location.lat +
                                                ' ' +
                                                items.current_location.lng
                                            }`}
                                        >
                                            <span className="text-sm font-bold text-blue-500 underline">
                                                Current Location:{' '}
                                                {
                                                    items.current_location
                                                        .full_address
                                                }
                                            </span>
                                        </Link>
                                    </div>
                                )}

                                {items.next_location.lat.length > 0 && (
                                    <div className="flex items-center gap-2 max-md:flex-col max-md:items-start">
                                        <div>
                                            <IconLocationUp />
                                        </div>
                                        <Link
                                            className="inline-block rounded-md bg-zinc-100 p-1"
                                            target="_blank"
                                            href={`https://www.google.com/maps/search/?api=1&query=${
                                                items.next_location.lat +
                                                ' ' +
                                                items.next_location.lng
                                            }`}
                                        >
                                            <span className="text-sm font-bold text-blue-500 underline">
                                                Next Location:{' '}
                                                {
                                                    items.next_location
                                                        .full_address
                                                }
                                            </span>
                                        </Link>
                                    </div>
                                )}

                                <div className="text-md flex font-mono text-gray-300">
                                    # {items.description}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-5xl font-bold">
                        no data
                    </div>
                )}
            </div>
        </div>
    )
}
