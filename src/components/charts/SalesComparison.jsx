import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Row, Col } from 'react-bootstrap';
import gstService from '../../services/gst.service';

const SalesComparison = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [
      {
        name: 'Total Sales Income',
        data: []
      },
      {
        name: 'Exempt Sales',
        data: []
      },
      {
        name: 'Zero Rated Sales',
        data: []
      },
      {
        name: 'GST Taxable Sales',
        data: []
      }
    ]
  });

  const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await gstService.getSalesComparison(startDate, endDate);
        
        // Process the response data
        const categories = [];
        const totalSalesData = [];
        const exemptSalesData = [];
        const zeroRatedSalesData = [];
        const gstTaxableSalesData = [];

        response.records.forEach(record => {
          record.monthly_summary.forEach(summary => {
            const date = new Date(record.year, summary.month - 1);
            categories.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
            totalSalesData.push(summary.total_sales_income);
            exemptSalesData.push(summary.exempt_sales);
            zeroRatedSalesData.push(summary.zero_rated_sales);
            gstTaxableSalesData.push(summary.gst_taxable_sales);
          });
        });

        // Check if all values are zero
        const allZero = totalSalesData.every(val => val === 0) &&
                       exemptSalesData.every(val => val === 0) &&
                       zeroRatedSalesData.every(val => val === 0) &&
                       gstTaxableSalesData.every(val => val === 0);

        setChartData({
          xAxis: categories,
          series: allZero ? [] : [
            {
              name: 'Total Sales Income',
              data: totalSalesData
            },
            {
              name: 'Exempt Sales',
              data: exemptSalesData
            },
            {
              name: 'Zero Rated Sales',
              data: zeroRatedSalesData
            },
            {
              name: 'GST Taxable Sales',
              data: gstTaxableSalesData
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching sales comparison data:', error);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.xAxis
    },
    yaxis: {
      title: {
        text: 'Amount ($)'
      },
      labels: {
        formatter: (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    },
    colors: colors,
    legend: {
      position: 'top'
    },
    noData: {
      text: 'No Data Found',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#6c757d',
        fontSize: '16px',
        fontFamily: 'inherit'
      }
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Row className="mb-4">
          <Col>
            <h5 className="card-title">Sales Comparison</h5>
          </Col>
        </Row>
        <ReactApexChart
          options={chartOptions}
          series={chartData.series}
          type="line"
          height={350}
        />
      </Card.Body>
    </Card>
  );
};

export default SalesComparison; 