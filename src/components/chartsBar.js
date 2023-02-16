import { Paper } from '@mui/material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  // for stacking. y-stacking disabled - to start growing from y=0, not from head of previous bar  
  scales: {
        x: {
            stacked: true
        },
        y: {
            stacked: false
        }
    },

  
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Прогресс выполнения заданий',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels,
  datasets: [
    {
      label: 'Europe',
      data: [12, 4, 6, 8, 4, 20, 5],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Asia',
      data: [11, 7, 16, 3, 14, 2, 15],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};


ChartJS.register(ArcElement, Tooltip, Legend);
const pieData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const PiePlugins = {
  legend: {
    position: 'bottom',
  },
  title: {
    display: true,
    text: 'Распределние ошибок в задании #i',
  },
}


export const ChartsBar = () => {
  return <Paper style={{ display: 'flex', justifyContent: 'start', rowGap: '2rem',
    width: '40%', marginTop: '4.5rem', padding: '1rem', 
    alignItems: 'center', flexDirection: 'column'}}>
                
    <div style={{width: '37rem'}}>
      <Bar options={options} data={data} />
    </div>                

    <div style={{width: '31rem'}}>
      <Pie options={{plugins: PiePlugins}} data={pieData} />
    </div>
  </Paper>
                
}