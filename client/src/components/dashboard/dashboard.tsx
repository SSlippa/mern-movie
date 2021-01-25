import { FC } from "react";
import './dashboard.css'
import MovieTable from "../data-table/movie-table";

interface IDashboardProps {
  votedM: string[]
}

const Dashboard: FC<IDashboardProps> = ({ votedM }) => {
     return (
        <div className='dashboard-wrapper'>
            <MovieTable votedMo={votedM}/>
        </div>
    )
}

export default Dashboard;
