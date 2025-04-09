import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countSelector, productSelector } from "../redux/selector";
import { decrease, increase } from "../redux/slices/countSlice";
import { fetchData } from "../redux/slices/productSlice";
import { Link } from "react-router";

function HomePage() {
    const dispatch = useDispatch();
    const { value } = useSelector(countSelector);
    const { data } = useSelector(productSelector);

    const increaseValue = () => {
        dispatch(increase());
    };

    const decreaseValue = () => {
        dispatch(decrease());
    };

    useEffect(() => {
        dispatch(fetchData());
    }, []);

    return (
        <div className="p-2.5 flex flex-col gap-2">
            <h1>Home page</h1>

            <div className="flex gap-4">
                <Link to="/login" className="underline text-blue-700">
                    Login
                </Link>

                <Link to="/register" className="underline text-blue-700">
                    Register
                </Link>
            </div>

            <div className="flex gap-2">
                <button onClick={decreaseValue}>-</button>
                <span>{value}</span>
                <button onClick={increaseValue}>+</button>
            </div>

            <div>
                <h3 className="font-semibold text-red-600">Product list</h3>
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>{item.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default HomePage;
