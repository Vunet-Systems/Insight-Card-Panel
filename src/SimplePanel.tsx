import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import React from 'react';
import * as d3 from 'd3';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  function topThree(list: any) {
    let temp: number;
    let indexI: number;
    let indexJ: number;
    let indexK = 0;
    let maxInt: number = list[0];

    for (indexI = 0; indexI < 3; indexI++) {
      maxInt = list[indexI];
      for (indexJ = indexI; indexJ < list.length; indexJ++) {
        if (list[indexJ] > maxInt) {
          maxInt = list[indexJ];
          indexK = indexJ;
        }
      }
      if (list[indexI] !== maxInt) {
        temp = list[indexK];
        list[indexK] = list[indexI];
        list[indexI] = temp;
      }
    }

    return [list[0], list[1], list[2]];
  }

  let actualData: any = data.series[0]['fields'][0]['values'];
  let topThereeData = topThree(actualData['buffer']);
  let topThreeDataSum: number = topThereeData[0] + topThereeData[1] + topThereeData[2];
  let topThreeStates = ['MH', 'KL', 'DL'];

  // const theme = useTheme();
  const scale = d3
    .scaleLinear()
    .domain([0, d3.max(topThereeData)])
    .range([0, width / 2]);
  const barHeight = 40;
  const padding = 30;

  return (
    <div style={{ width: width, height: height }}>
      <h2 style={{ color: 'lightblue' }}>{topThreeDataSum}%</h2>
      <h4>Top 3 States to Contribute {topThreeDataSum}% percentage of active Covid cases</h4>
      {topThereeData.map((value: any, index: any) => (
        <g key={index} className="row">
          <div>
            <svg x={20} y={index * barHeight} width={width / 2 + padding} height={barHeight}>
              <rect key={index} x={20} y={0} width={scale(value)} height={barHeight} fill="blue" />
            </svg>
          </div>
          <div style={{ width: 30 }}>
            <h4>{topThreeStates[index]}</h4>
          </div>
          <div>
            <h4 style={{ color: 'lightblue', paddingLeft: 15 }}>{value}%</h4>
          </div>
        </g>
      ))}
    </div>
  );
};
