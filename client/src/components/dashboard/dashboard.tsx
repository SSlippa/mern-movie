import React from "react";
import './dashboard.css'
import MovieTable from "../data-table/movie-table";

interface IDashboardProps {
  votedM: string[]
}

const Dashboard = ({votedM}: IDashboardProps) => {
     return (
        <div className='dashboard-wrapper'>
            <MovieTable votedM={votedM}/>
        </div>
    )
}

export default Dashboard;
