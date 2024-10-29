import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinancialStats } from '../../store/slices/financeSlice';
import DonationForm from './DonationForm';
import TransactionList from './TransactionList';
import FinancialReport from './FinancialReport';

const FinanceDashboard = () => {
  const [openDonationForm, setOpenDonationForm] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(state => state.finance);

  useEffect(() => {
    dispatch(fetchFinancialStats());
  }, [dispatch]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4" color="primary">
                ${stats.totalIncome?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="h4" color="error">
                ${stats.totalExpenses?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Net Balance</Typography>
              <Typography variant="h4" color="success">
                ${stats.netBalance?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Current Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Income Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Income Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#4caf50" name="Income" />
                  <Bar dataKey="expenses" fill="#f44336" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Recent Transactions</Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDonationForm(true)}
                sx={{ mr: 1 }}
              >
                Record Donation
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenReport(true)}
              >
                Generate Report
              </Button>
            </Box>
          </Box>
          <TransactionList />
        </Grid>
      </Grid>

      <Dialog
        open={openDonationForm}
        onClose={() => setOpenDonationForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DonationForm onClose={() => setOpenDonationForm(false)} />
      </Dialog>

      <Dialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        maxWidth="md"
        fullWidth
      >
        <FinancialReport onClose={() => setOpenReport(false)} />
      </Dialog>
    </Box>
  );
};

export default FinanceDashboard; 