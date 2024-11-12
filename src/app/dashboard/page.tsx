import React from "react";
import PopularProduct from "./PopularProduct";
import SumItemChart from "./SumItemChart";
import TopProvider from "./TopProvider";
import OccupiedTable from "./OccupiedTable";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl: overflow-auto gap-10 pl-7 pb-4 custom-grid-rows">
            <PopularProduct />
            <OccupiedTable />
            <SumItemChart />
            <TopProvider />
        </div>
    );
};

export default Dashboard;
