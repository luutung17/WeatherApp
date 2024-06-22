import React, { useEffect, useState } from "react";

function History() {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        let storedCities = JSON.parse(localStorage.getItem("searchHistory"));
        if (!storedCities) {
            const fakeData = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Nha Trang"];
            localStorage.setItem("searchHistory", JSON.stringify(fakeData));
            storedCities = fakeData;
        }
        
        setCities(storedCities);
    }, []);

    return (
        <div className="history-page p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Lịch sử tìm kiếm</h1>
            <ul className="bg-white shadow-md rounded-lg p-4">
                {cities.length > 0 ? (
                    cities.map((city, index) => (
                        <li
                            key={index}
                            className="border-b last:border-b-0 p-4 text-lg text-gray-700"
                        >
                            {city}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500 text-center">Không có lịch sử tìm kiếm</li>
                )}
            </ul>
        </div>
    );
}

export default History;
