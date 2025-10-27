"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

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
            time: string;
            status: string;
            description: string;
            buyer_description: string;
            tracking_code: string;
            current_location: {
                full_address: string;
                lat: string;
                lng: string;
            };
        }[];
    };
};

export default function Page() {
    const [txtInput, setTxtInput] = useState<string | null>(null);
    const [txt, setTxt] = useState<Data | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        axios
            .get("/api")
            .then((res) => {
                setTxt(res.data.data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    if (loading) {
        return (
            <div className="h-screen bg-zinc-100 flex items-center justify-center">
                <div>loading...</div>
            </div>
        );
    }

    const handleChangeTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTxtInput(event.target.value.toUpperCase());
    };

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!txtInput?.length) {
            setTxt(null);
            return;
        }
        axios
            .get(`/api?spx_tn=${txtInput}`)
            .then((res) => {
                console.log(res.data.data);
                setTxt(res.data.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center gap-5">
            <div className="grid grid-cols-1 gap-4 h-full">
                <div className="m-4">
                    <form onSubmit={handleSearch}>
                        <div className="flex p-6 rounded-2xl shadow-md items-center justify-center gap-2">
                            <div className="font-medium w-fit text-nowrap">
                                กรอกเลขพัสดุ
                            </div>
                            <input
                                type="text"
                                onChange={handleChangeTxt}
                                className="outline-2 outline-zinc-200 focus:outline-black rounded-sm p-1 w-full"
                            />
                        </div>
                    </form>
                </div>
                {txt?.sls_tracking_info.records ? (
                    txt.sls_tracking_info.records.map((items, index) => (
                        <div
                            className="p-6 shadow-md rounded-2xl flex flex-col gap-4"
                            key={index}
                        >
                            <div>
                                <span className="font-bold">Status:</span>{" "}
                                {items.buyer_description}
                            </div>
                            {items.current_location.full_address && (
                                <div>
                                    <span className="font-bold">Address:</span>{" "}
                                    {items.current_location.full_address}
                                </div>
                            )}
                            {items.current_location.lat.length > 0 && (
                                <div>
                                    <Link
                                        className="bg-zinc-100 rounded-md p-1"
                                        target="_blank"
                                        href={`https://www.google.com/maps/search/?api=1&query=${
                                            items.current_location.lat +
                                            " " +
                                            items.current_location.lng
                                        }`}
                                    >
                                        <span className="text-blue-600 underline">
                                            URL ADDRESS:{" "}
                                            {
                                                items.current_location
                                                    .full_address
                                            }
                                        </span>
                                    </Link>
                                </div>
                            )}
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
