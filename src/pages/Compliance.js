import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import { FixedSizeList as List } from 'react-window';
import BarChart from '../components/charts/BarChart';
import EmployeeLineChart from '../components/charts/EmployeeLineChart';
import MonthlySalesTaxSummaryChart from '../components/charts/MonthlySalesTaxSummaryChart';
import RiskBreakdownChart from '../components/charts/RiskBreakDownChart';
import SwtSalariesChart from '../components/charts/SwtSalariesChart';
import TenureFilter from '../components/filters/TenureFilter';
import Layout from '../components/Layout';
import { fetchDatasets } from '../slice/datasetsSlice';
import { fetchSalesComparison } from '../slice/salesComparisonSlice';

// Chart data
const chartData = {
  year: 2021,
  monthly_summary: [
    {
      month: 1,
      sales_income: 126373775.73,
      'taxable sales': 54384797.34,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 2,
      sales_income: 129387884.22,
      'taxable sales': 54179870.51,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 3,
      sales_income: 134569635.77,
      'taxable sales': 62371654.93,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 4,
      sales_income: 118586143.34,
      'taxable sales': 54776090.99,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 5,
      sales_income: 136307860.31,
      'taxable sales': 68182368.37,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 6,
      sales_income: 141763424.29,
      'taxable sales': 69061170.58,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 7,
      sales_income: 151393884.66,
      'taxable sales': 75163746.05,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 8,
      sales_income: 145526770.0,
      'taxable sales': 83020949.22,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 9,
      sales_income: 151897371.62,
      'taxable sales': 62101578,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 10,
      sales_income: 151341500.9,
      'taxable sales': 66115749.16,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 11,
      sales_income: 150092957.78,
      'taxable sales': 68516088.32,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
    {
      month: 12,
      sales_income: 189451172.61,
      'taxable sales': 78896612.29,
      zero_rated_sales: 100,
      exempt_sales: 20,
    },
  ],
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Add area chart options
const areaChartOptions = {
  chart: {
    type: 'area',
    height: 320,
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: [3, 3, 2, 2],
  },
  xaxis: {
    categories: months,
    title: { text: 'Month' },
  },
  yaxis: {
    labels: {
      formatter: (val) =>
        val >= 1000 ? `${(val / 1000000).toFixed(1)}M` : val,
    },
  },
  legend: {
    position: 'top',
  },
  colors: ['#2563eb', '#22c55e', '#f59e42', '#a0aec0'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
};

const customAreaChartOptions = {
  chart: {
    type: 'area',
    height: 320,
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 0, // No border line, just fill
  },
  fill: {
    type: 'solid',
    colors: ['#7c3aed'],
    opacity: 0.85,
  },
  xaxis: {
    categories: months,
    labels: {
      style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
      formatter: (val) =>
        val >= 1000 ? `${(val / 1000000).toFixed(1)}M` : val,
    },
    grid: { show: true },
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  tooltip: {
    theme: 'light',
    style: { fontSize: '15px' },
  },
  legend: { show: false },
  colors: ['#7c3aed'],
  markers: { size: 0 },
};

const customAreaChartSeries = [
  {
    name: 'Sales Income',
    data: chartData.monthly_summary.map((m) => m.sales_income),
  },
];

// Radar chart options and series for employee data

const employeeData = {
  year: 2024,
  monthly_data: [
    { month: '01', employees_on_payroll: 1200, employees_paid_swt: 950 },
    { month: '02', employees_on_payroll: 1250, employees_paid_swt: 980 },
    { month: '03', employees_on_payroll: 1300, employees_paid_swt: 1000 },
    { month: '04', employees_on_payroll: 1280, employees_paid_swt: 1020 },
    { month: '05', employees_on_payroll: 1350, employees_paid_swt: 1100 },
    { month: '06', employees_on_payroll: 1400, employees_paid_swt: 1150 },
    { month: '07', employees_on_payroll: 1425, employees_paid_swt: 1200 },
    { month: '08', employees_on_payroll: 1450, employees_paid_swt: 1250 },
    { month: '09', employees_on_payroll: 1500, employees_paid_swt: 1300 },
    { month: '10', employees_on_payroll: 1520, employees_paid_swt: 1350 },
    { month: '11', employees_on_payroll: 1550, employees_paid_swt: 1400 },
    { month: '12', employees_on_payroll: 1600, employees_paid_swt: 1450 },
  ],
};

const employeeMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const employeeRadarOptions = {
  chart: {
    type: 'radar',
    height: 350,
    toolbar: { show: false },
  },
  xaxis: {
    categories: employeeMonths,
    labels: {
      style: { fontWeight: 500, color: '#334155', fontSize: '14px' },
    },
  },
  yaxis: {
    labels: {
      style: { fontWeight: 500, color: '#334155' },
    },
  },
  legend: {
    position: 'top',
    fontWeight: 600,
  },
  colors: ['#6366f1', '#a5b4fc'],
  stroke: {
    width: 2,
  },
  fill: {
    opacity: 0.2,
  },
  markers: {
    size: 4,
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    style: { fontSize: '15px' },
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const month = w.globals.categoryLabels[dataPointIndex];
      const payroll = series[0][dataPointIndex];
      const paidSwt = series[1][dataPointIndex];
      return `
        <div style="padding:8px 12px;">
          <div style="font-weight:600; color:#6366f1; margin-bottom:4px;">${month}</div>
          <div><span style="color:#6366f1;">●</span> Employees on Payroll: <b>${payroll}</b></div>
          <div><span style="color:#a5b4fc;">●</span> Employees Paid SWT: <b>${paidSwt}</b></div>
        </div>
      `;
    },
  },
};

const employeeRadarSeries = [
  {
    name: 'Employees on Payroll',
    data: employeeData.monthly_data.map((m) => m.employees_on_payroll),
  },
  {
    name: 'Employees Paid SWT',
    data: employeeData.monthly_data.map((m) => m.employees_paid_swt),
  },
];

// SWT Salaries Comparison Data
const swtSalariesData = {
  year: 2024,
  monthly_data: [
    {
      month: 1,
      total_salary_wages_paid: 1000000,
      sw_paid_for_swt_deduction: 800000,
      total_swt_tax_deducted: 1060000,
    },
    {
      month: 2,
      total_salary_wages_paid: 1050000,
      sw_paid_for_swt_deduction: 850000,
      total_swt_tax_deducted: 68000,
    },
    {
      month: 3,
      total_salary_wages_paid: 1100000,
      sw_paid_for_swt_deduction: 60000,
      total_swt_tax_deducted: 1100000,
    },
    {
      month: 4,
      total_salary_wages_paid: 280000,
      sw_paid_for_swt_deduction: 870000,
      total_swt_tax_deducted: 71000,
    },
    {
      month: 5,
      total_salary_wages_paid: 1150000,
      sw_paid_for_swt_deduction: 920000,
      total_swt_tax_deducted: 75000,
    },
    {
      month: 6,
      total_salary_wages_paid: 2200000,
      sw_paid_for_swt_deduction: 950000,
      total_swt_tax_deducted: 1900000,
    },
    {
      month: 7,
      total_salary_wages_paid: 2230000,
      sw_paid_for_swt_deduction: 90000,
      total_swt_tax_deducted: 80000,
    },
    {
      month: 8,
      total_salary_wages_paid: 50000,
      sw_paid_for_swt_deduction: 1000000,
      total_swt_tax_deducted: 82000,
    },
    {
      month: 9,
      total_salary_wages_paid: 1270000,
      sw_paid_for_swt_deduction: 1020000,
      total_swt_tax_deducted: 83000,
    },
    {
      month: 10,
      total_salary_wages_paid: 1300000,
      sw_paid_for_swt_deduction: 1040000,
      total_swt_tax_deducted: 85000,
    },
    {
      month: 11,
      total_salary_wages_paid: 20000,
      sw_paid_for_swt_deduction: 1060000,
      total_swt_tax_deducted: 86000,
    },
    {
      month: 12,
      total_salary_wages_paid: 1350000,
      sw_paid_for_swt_deduction: 1080000,
      total_swt_tax_deducted: 88000,
    },
  ],
  totals: {
    total_salary_wages_paid: 14630000,
    total_sw_paid_for_swt_deduction: 11510000,
    total_swt_tax_deducted: 960000,
  },
};

const swtSalariesMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const swtSalariesChartSeries = [
  {
    name: 'Total Salary Wages Paid',
    data: swtSalariesData.monthly_data.map((m) => m.total_salary_wages_paid),
  },
  {
    name: 'SW Paid for SWT Deduction',
    data: swtSalariesData.monthly_data.map((m) => m.sw_paid_for_swt_deduction),
  },
  {
    name: 'Total SWT Tax Deducted',
    data: swtSalariesData.monthly_data.map((m) => m.total_swt_tax_deducted),
  },
];

const swtSalariesChartOptions = {
  chart: {
    type: 'area',
    height: 320,
    toolbar: { show: false },
    // background: '#fff' // Remove this line to eliminate white background
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: [2, 2, 2],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.45,
      stops: [0, 90, 100],
    },
  },
  xaxis: {
    categories: swtSalariesMonths,
    title: { text: 'Month' },
    labels: {
      style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
    },
    axisBorder: { show: true, color: '#e0e7ef' }, // Ensure border is visible and matches other chart
    axisTicks: { show: true, color: '#e0e7ef' }, // Ensure ticks are visible and matches other chart
    offsetY: 0, // Align with EmployeeLineChart
    position: 'bottom',
  },
  yaxis: {
    labels: {
      style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
      formatter: (val) =>
        val >= 1000 ? `${(val / 1000000).toFixed(1)}M` : val,
    },
  },
  legend: {
    position: 'top',
    fontWeight: 700,
    labels: {
      colors: ['#4338ca', '#22c55e', '#f59e42'],
    },
  },
  colors: ['#4338ca', '#22c55e', '#f59e42'],
  tooltip: {
    shared: true,
    intersect: false,
    style: { fontSize: '15px' },
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
  },
};

// Multi-series line chart for Employees on Payroll vs Paid SWT (2024)
const employeeLineSeries = [
  {
    name: 'Employees on Payroll',
    data: employeeData.monthly_data.map((m) => m.employees_on_payroll),
  },
  {
    name: 'Employees Paid SWT',
    data: employeeData.monthly_data.map((m) => m.employees_paid_swt),
  },
];

const employeeLineOptions = {
  chart: {
    type: 'line',
    height: 320,
    toolbar: { show: false },
  },
  stroke: {
    width: 3,
    curve: 'smooth',
  },
  xaxis: {
    categories: employeeMonths,
    title: { text: 'Month' },
    labels: {
      style: { fontWeight: 500, color: '#334155', fontSize: '14px' },
    },
  },
  yaxis: {
    title: { text: 'Employees' },
    labels: {
      style: { fontWeight: 500, color: '#334155' },
    },
  },
  legend: {
    position: 'top',
    fontWeight: 600,
  },
  colors: ['#2563eb', '#22c55e'],
  markers: {
    size: 5,
  },
  tooltip: {
    shared: true,
    intersect: false,
    style: { fontSize: '15px' },
  },
  grid: {
    borderColor: '#e0e7ef',
    strokeDashArray: 4,
  },
};

const Compliance = () => {
  const dispatch = useDispatch();
  const [selectedTIN, setSelectedTIN] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dateRange, setDateRange] = useState('');
  const { data, loading, error } = useSelector((state) => state.datasets);
  const { monthlySalesData, monthlySalesLoading, monthlySalesError } =
    useSelector((state) => state?.salesComparison);

  const tins = data?.tins || [];
  const salesData = monthlySalesData?.monthlySalesData || [];
  const yearOptions =
    data?.years?.map((year) => ({
      label: String(year),
      value: String(year),
    })) || [];

  const handleFilterChange = (range) => {
    setDateRange(range);
  };

  const handleSearch = () => {
    // Implement search logic here
    // You can use selectedTax, dateRange.start_date, dateRange.end_date
    dispatch(
      fetchSalesComparison({
        start_date: '01-01-2021',
        end_date: '31-12-2022',
        tin: '500000009',
      })
    );
  };

  useEffect(() => {
    if (!data) {
      dispatch(fetchDatasets());
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!monthlySalesData) {
      dispatch(
        fetchSalesComparison({
          start_date: '01-01-2021',
          end_date: '31-12-2022',
          tin: '500000009',
        })
      );
    }
  }, [monthlySalesData, dispatch]);

  console.log('monthlySalesData ', salesData);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (error || monthlySalesError) {
      toast.error(error, { position: 'top-right' });
    }
  }, [error, monthlySalesError]);

  useEffect(() => {
    if (data?.tins && data.tins.length > 0) {
      setSelectedTIN(data.tins[0]);
    }
  }, [data?.tins]);

  if (loading || monthlySalesLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <ClipLoader size={60} color="#2563eb" />
        <ToastContainer />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Layout>
        <div className="page-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <label style={{ fontWeight: 'bold', marginRight: 8 }}>TIN</label>
            <div ref={dropdownRef} style={{ position: 'relative', width: 260 }}>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: 8,
                  background: '#fff',
                  cursor: 'pointer',
                  minHeight: 38,
                  userSelect: 'none',
                }}
                onClick={() => setIsDropdownOpen((open) => !open)}
              >
                {selectedTIN || 'Select TIN'}
              </div>
              {isDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    width: '100%',
                    zIndex: 10,
                    border: '1px solid #eee',
                    borderRadius: 4,
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    maxHeight: 200,
                    overflow: 'hidden',
                  }}
                >
                  <List
                    height={200}
                    itemCount={tins.length}
                    itemSize={35}
                    width={240}
                  >
                    {({ index, style }) => (
                      <div
                        style={{
                          ...style,
                          padding: '8px 12px',
                          background:
                            tins[index] === selectedTIN ? '#e0e7ef' : '#fff',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setSelectedTIN(tins[index]);
                          setIsDropdownOpen(false);
                        }}
                        key={tins[index]}
                      >
                        {tins[index]}
                      </div>
                    )}
                  </List>
                </div>
              )}
            </div>
            <div
              style={{
                flex: '0 1 auto',
                minWidth: 0,
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TenureFilter
                onFilterChange={handleFilterChange}
                tenureOptions={yearOptions}
              />
            </div>
            <button
              onClick={handleSearch}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '8px 24px',
                fontWeight: 500,
                marginLeft: 8,
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Chart Card Section */}
        <div
          style={{
            marginTop: 32,
            border: '1px solid #f1f5f9',
            borderRadius: 16,
            background: '#fff',
            boxShadow: '0 0 0 0 #0000',
            padding: '24px 24px 8px 24px',
            minWidth: 900,
            maxWidth: 1200,
          }}
        >
          <MonthlySalesTaxSummaryChart />
        </div>
        {/* End Chart Card Section */}

        {/* --- Bar Chart Row --- */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 32,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {/* Line Chart Card */}
          <div
            style={{
              flex: 1,
              maxWidth: '50%',
              border: '1px solid #e0e7ef',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #f1f5ff 0%, #fff 100%)',
              boxShadow: '0 2px 16px 0 #e0e7ef55',
              padding: '32px 32px 16px 32px',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <RiskBreakdownChart />
          </div>

          {/* SWT Chart Card */}
          <div
            style={{
              flex: 1,
              maxWidth: '50%',
              border: '1px solid #e0e7ef',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #f1f5ff 0%, #fff 100%)',
              boxShadow: '0 2px 16px 0 #e0e7ef55',
              padding: '32px 32px 16px 32px',
              minWidth: 0, // allow shrinking
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: '#6366f1',
                letterSpacing: 1,
                minHeight: 28,
                marginBottom: 18,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              Total TaxPayers vs Risk Flagged ({chartData.year})
            </div>
            <BarChart />
          </div>
        </div>
        {/* <div
        style={{
          marginTop: 32,
          border: '1px solid #f1f5f9',
          borderRadius: 16,
          background: '#fff',
          boxShadow: '0 0 0 0 #0000',
          padding: '24px 24px 8px 24px',
          minWidth: 900,
          maxWidth: 1200
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: '#222' }}>
          Total TaxPayers vs Risk Flagged ({chartData.year})
        </div>
        <BarChart />
      </div> */}
        {/* --- End Bar Chart Row --- */}

        {/* --- Line & SWT Chart Row --- */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 32,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {/* Line Chart Card */}
          <div
            style={{
              flex: 1,
              maxWidth: '50%',
              border: '1px solid #e0e7ef',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #f1f5ff 0%, #fff 100%)',
              boxShadow: '0 2px 16px 0 #e0e7ef55',
              padding: '32px 32px 16px 32px',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: '#6366f1',
                letterSpacing: 1,
                minHeight: 28,
                marginBottom: 18,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              Employees on Payroll vs Paid SWT (Line) (2024)
            </div>
            <EmployeeLineChart
              options={employeeLineOptions}
              series={employeeLineSeries}
            />
          </div>
          {/* SWT Chart Card */}
          <div
            style={{
              flex: 1,
              maxWidth: '50%',
              border: '1px solid #e0e7ef',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #f1f5ff 0%, #fff 100%)',
              boxShadow: '0 2px 16px 0 #e0e7ef55',
              padding: '32px 32px 16px 32px',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: '#6366f1',
                letterSpacing: 1,
                minHeight: 28,
                marginBottom: 18,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              SWT Salaries Comparison (2024)
            </div>
            <SwtSalariesChart
              options={swtSalariesChartOptions}
              series={swtSalariesChartSeries}
            />
          </div>
        </div>
        {/* --- End Line & SWT Chart Row --- */}
      </Layout>
    </>
  );
};

export default Compliance;
