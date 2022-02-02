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
      indices[indexI] = indexI;
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
        indices[indexI] = indexK;
      }
    }
    return [list[0], list[1], list[2]];
  }

  let indices: any = [];
  let actualData: any = data.series[0]['fields'][1]['values'];
  let topThereeData = topThree(actualData['buffer']);
  let topThreeDataSum: number = topThereeData[0] + topThereeData[1] + topThereeData[2];
  let topThreeStates: any = data.series[0]['fields'][0]['values'];

  const scale = d3
    .scaleLinear()
    .domain([0, d3.max(topThereeData)])
    .range([0, width / 3]);
  const barHeight = 20;

  return (
    <div
      style={{
        width: width,
        height: height,
      }}
    >
      <h1 style={{ color: 'lightblue' }}>{topThreeDataSum}%</h1>
      <div style={{ paddingLeft: 25, paddingRight: 25 }}>
        <h2 style={{ paddingLeft: 15 }}>
          Top 3 States contribute to {topThreeDataSum}% percentage of active Covid cases.
        </h2>
        {topThereeData.map((value: any, index: any) => (
          <g key={index} className="row">
            <div>
              <svg x={25} y={index * barHeight} width={width / 3} height={barHeight}>
                <rect key={index} x={25} y={0} width={scale(value)} height={barHeight} fill="blue" />
              </svg>
            </div>
            <div>
              <h4 style={{ paddingLeft: 10, width: 40 }}> {topThreeStates['buffer'][indices[index]]}</h4>
            </div>
            <div>
              <h4 style={{ paddingLeft: 10, color: 'lightblue' }}>{value}%</h4>
            </div>
          </g>
        ))}
      </div>
    </div>
  );
};
