'use client';

import React, { useEffect } from 'react';
import { ChartData } from '@/lib/types';

interface BarChartProps {
  data: ChartData[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  minValue: number;
  maxValue: number;
  padding: number;
  upColor: string;
  downColor: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  containerRef,
  minValue,
  maxValue,
  padding,
  upColor,
  downColor,
}) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const svgElement = container.querySelector('svg');
      if (!svgElement) return;

      // 기존 바 차트 요소 제거
      const existingGroup = svgElement.querySelector('g.bar-chart-overlay');
      if (existingGroup) {
        existingGroup.remove();
      }

      // SVG 크기 가져오기
      const svgRect = svgElement.getBoundingClientRect();
      const width = svgRect.width;
      const height = svgRect.height;

      if (width <= 0 || height <= 0) return;

      // 차트 영역 계산
      const chartLeft = 80;
      const chartRight = width - 50;
      const chartTop = 20;
      const chartBottom = height - 30;
      const chartWidth = chartRight - chartLeft;
      const chartHeight = chartBottom - chartTop;

      // 클리핑 경로 생성
      let clipPath = svgElement.querySelector('#chart-clip');
      if (!clipPath) {
        const defs = svgElement.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'chart-clip');
        const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        clipRect.setAttribute('x', String(chartLeft));
        clipRect.setAttribute('y', String(chartTop));
        clipRect.setAttribute('width', String(chartWidth));
        clipRect.setAttribute('height', String(chartHeight));
        clipPath.appendChild(clipRect);
        if (!svgElement.querySelector('defs')) {
          svgElement.insertBefore(defs, svgElement.firstChild);
        }
        defs.appendChild(clipPath);
      }

      // 새로운 그룹 생성
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'bar-chart-overlay');
      group.setAttribute('clip-path', 'url(#chart-clip)');

      const barWidth = chartWidth / data.length;
      const scale = chartHeight / (maxValue - minValue + padding * 2);
      const offsetY = chartTop;
      const tickWidth = Math.max(barWidth * 0.3, 3);

      data.forEach((entry: any, index: number) => {
        if (
          typeof entry.open !== 'number' ||
          typeof entry.close !== 'number' ||
          typeof entry.high !== 'number' ||
          typeof entry.low !== 'number'
        ) {
          return;
        }

        const isUp = entry.close >= entry.open;
        const color = isUp ? upColor : downColor;

        // X 좌표 계산
        const x = chartLeft + index * barWidth + barWidth / 2;

        // Y 좌표 계산
        const highY = offsetY + (maxValue + padding - entry.high) * scale;
        const lowY = offsetY + (maxValue + padding - entry.low) * scale;
        const openY = offsetY + (maxValue + padding - entry.open) * scale;
        const closeY = offsetY + (maxValue + padding - entry.close) * scale;

        // 수직선 (고가-저가)
        const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        verticalLine.setAttribute('x1', String(x));
        verticalLine.setAttribute('y1', String(highY));
        verticalLine.setAttribute('x2', String(x));
        verticalLine.setAttribute('y2', String(lowY));
        verticalLine.setAttribute('stroke', color);
        verticalLine.setAttribute('stroke-width', '2');
        group.appendChild(verticalLine);

        // 시가 (왼쪽 tick)
        const openTick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        openTick.setAttribute('x1', String(x - tickWidth));
        openTick.setAttribute('y1', String(openY));
        openTick.setAttribute('x2', String(x));
        openTick.setAttribute('y2', String(openY));
        openTick.setAttribute('stroke', color);
        openTick.setAttribute('stroke-width', '2');
        group.appendChild(openTick);

        // 종가 (오른쪽 tick)
        const closeTick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        closeTick.setAttribute('x1', String(x));
        closeTick.setAttribute('y1', String(closeY));
        closeTick.setAttribute('x2', String(x + tickWidth));
        closeTick.setAttribute('y2', String(closeY));
        closeTick.setAttribute('stroke', color);
        closeTick.setAttribute('stroke-width', '2');
        group.appendChild(closeTick);
      });

      svgElement.appendChild(group);
    }, 200);

    return () => clearTimeout(timer);
  }, [data, containerRef, minValue, maxValue, padding, upColor, downColor]);

  return null;
};

