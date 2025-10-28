"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { timeStamp } from "node:console";
import {
    IconHomeDot,
    IconLocation,
    IconLocationUp,
    IconPoint,
    IconTimelineEventText,
} from "@tabler/icons-react";

type Data = {
    fulfillment_info: {
        deliver_type: number;
    };
    is_instant_order: boolean;
    sls_tracking_info: {
        sls_tn: string;
        client_order_id: string;
        receiver_name: string;
        records: {
            actual_time: number;
            status: string;
            description: string;
            buyer_description: string;
            tracking_code: string;
            current_location: {
                full_address: string;
                lat: string;
                lng: string;
            };
            next_location: {
                full_address: string;
                lat: string;
                lng: string;
                location_name: string;
            };
        }[];
    };
};

export default function Page() {
    const [txtInput, setTxtInput] = useState<string | null>(null);
    const [txt, setTxt] = useState<Data | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        axios
            .get("/api")
            .then((res) => {
                setTxt(res.data.data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleChangeTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTxtInput(event.target.value.toUpperCase());
    };

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!txtInput?.length) {
            setTxt(null);
            return;
        }
        setLoading(true);
        axios
            .get(`/api?spx_tn=${txtInput}`)
            .then((res) => {
                setTxt(res.data.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    const handleSearchClick = async (
        event: React.MouseEvent<HTMLInputElement>,
    ) => {
        if (!txtInput?.length) {
            setTxt(null);
            return;
        }
        setLoading(true);
        axios
            .get(`/api?spx_tn=${txtInput}`)
            .then((res) => {
                console.log(res.data);
                setTxt(res.data.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    const changeTimeToTime = (timeStamp: number) => {
        const date = new Date(timeStamp * 1000);

        const time = date.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        return time;
    };

    const changeTimeToDate = (timeStamp: number) => {
        const date = new Date(timeStamp * 1000);

        const dates = date.toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        return dates;
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center gap-5">
            {loading && (
                <div className="absolute h-screen w-screen bg-white opacity-40 flex flex-col items-center justify-center">
                    <div className="animate-pulse text-2xl select-none">
                        Loading...
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 gap-4 h-full px-4 max-w-6xl">
                <div className="my-6 w-full">
                    <form onSubmit={handleSearch}>
                        <div className="flex p-6 rounded-2xl shadow-md items-center justify-center gap-2">
                            <div className="font-medium w-fit text-nowrap select-none">
                                กรอกเลขพัสดุ
                            </div>
                            <input
                                type="text"
                                onChange={handleChangeTxt}
                                className="outline-2 outline-zinc-200 focus:outline-zinc-500 rounded-sm p-1 w-full"
                            />
                            <div
                                className="bg-zinc-100 hover:bg-zinc-200 transition-all active:scale-90 duration-300 p-1.5 rounded-md cursor-pointer "
                                onClick={handleSearchClick}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    className=""
                                >
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    />
                                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                                    <path d="M21 21l-6 -6" />
                                </svg>
                            </div>
                        </div>
                    </form>
                </div>
                {txt?.sls_tracking_info.records ? (
                    txt.sls_tracking_info.records.map((items, index) => (
                        <div
                            className="p-4 gap-4 shadow-md rounded-2xl flex divide-x-2 divide-zinc-300 max-md:divide-none max-md:flex-col"
                            key={index}
                        >
                            <div className="p-2 flex max-sm:gap-5 sm:flex-col justify-center items-center font-medium text-nowrap max-md:items-start max-md:w-fit">
                                <IconTimelineEventText className="text-zinc-500" />
                                <div>{changeTimeToTime(items.actual_time)}</div>
                                <div>{changeTimeToDate(items.actual_time)}</div>
                            </div>

                            <div className="flex-col gap-4 flex">
                                <div className="flex gap-2 items-start max-md:flex-col">
                                    <div className="font-bold flex gap-2">
                                        <IconPoint className="" />
                                        Status:
                                    </div>{" "}
                                    {items.buyer_description}
                                </div>

                                {items.current_location.full_address && (
                                    <div className="flex gap-2 items-start max-md:flex-col">
                                        <div className="font-bold flex gap-2">
                                            <IconHomeDot className="" />
                                            Address:
                                        </div>{" "}
                                        {items.current_location.full_address}
                                    </div>
                                )}

                                {items.current_location.lat.length > 0 && (
                                    <div className="flex gap-2 items-center max-md:flex-col max-md:items-start">
                                        <div>
                                            <IconLocation />
                                        </div>
                                        <Link
                                            className="bg-zinc-100 rounded-md p-1 inline-block "
                                            target="_blank"
                                            href={`https://www.google.com/maps/search/?api=1&query=${
                                                items.current_location.lat +
                                                " " +
                                                items.current_location.lng
                                            }`}
                                        >
                                            <span className="font-bold text-blue-500 underline text-sm">
                                                Current Location:{" "}
                                                {
                                                    items.current_location
                                                        .full_address
                                                }
                                            </span>
                                        </Link>
                                    </div>
                                )}

                                {items.next_location.lat.length > 0 && (
                                    <div className="flex gap-2 items-center max-md:flex-col max-md:items-start">
                                        <div>
                                            <IconLocationUp />
                                        </div>
                                        <Link
                                            className="bg-zinc-100 rounded-md p-1 inline-block"
                                            target="_blank"
                                            href={`https://www.google.com/maps/search/?api=1&query=${
                                                items.next_location.lat +
                                                " " +
                                                items.next_location.lng
                                            }`}
                                        >
                                            <span className="font-bold text-blue-500 underline text-sm">
                                                Next Location:{" "}
                                                {
                                                    items.next_location
                                                        .full_address
                                                }
                                            </span>
                                        </Link>
                                    </div>
                                )}

                                <div className="flex font-mono text-md text-gray-300">
                                    # {items.description}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center font-bold text-5xl">
                        no data
                    </div>
                )}
            </div>
        </div>
    );
}
