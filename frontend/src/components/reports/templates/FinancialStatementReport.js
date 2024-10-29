import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const FinancialStatementReport = ({ data, period }) => {
  // Sample data structure
  const financialData = {
    summary: {
      totalIncome: 50000,
      totalExpenses: 35000,
      netBalance: 15000,
      growthRate: '+10%'
    },
    income: {
      tithes: 30000,
      offerings: 15000,
      specialOfferings: 5000
    },
    expenses: {
      utilities: 5000,
      rent: 20000,
      maintenance: 3000,
      ministry: 7000
    },
    transactions: [
      {
        date: '2024-01-07',
        type: 'Tithe',
        amount: 5000,
        category: 'Income',
        memberId: 'COPAD0001',
        memberName: 'John Doe',
        paymentMethod: 'Bank Transfer',
        reference: 'TRX123456'
      },
      {
        date: '2024-01-07',
        type: 'Offering',
        amount: 1000,
        category: 'Income',
        memberId: 'COPAD0002',
        memberName: 'Jane Smith',
        paymentMethod: 'Cash',
        reference: 'TRX123457'
      },
      // More transactions...
    ],
    memberContributions: [
      {
        memberId: 'COPAD0001',
        memberName: 'John Doe',
        tithes: 15000,
        offerings: 3000,
        specialOfferings: 1000,
        totalContributions: 19000
      },
      // More member contributions...
    ]
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Financial Statement - {period}
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h4">
                AED {financialData.summary.totalIncome.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.main">
                {financialData.summary.growthRate} from last {period}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h4">
                AED {financialData.summary.totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Net Balance
              </Typography>
              <Typography variant="h4" color={financialData.summary.netBalance >= 0 ? 'success.main' : 'error.main'}>
                AED {financialData.summary.netBalance.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Income Breakdown */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Income Breakdown
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount (AED)</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(financialData.income).map(([category, amount]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell align="right">{amount.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      {((amount / financialData.summary.totalIncome) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Expenses Breakdown */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Expenses Breakdown
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount (AED)</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(financialData.expenses).map(([category, amount]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell align="right">{amount.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      {((amount / financialData.summary.totalExpenses) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Member Contributions Summary */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Member Contributions Summary
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Tithes (AED)</TableCell>
                  <TableCell align="right">Offerings (AED)</TableCell>
                  <TableCell align="right">Special (AED)</TableCell>
                  <TableCell align="right">Total (AED)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {financialData.memberContributions.map((member) => (
                  <TableRow key={member.memberId}>
                    <TableCell>
                      <Link to={`/members/${member.memberId}`}>
                        {member.memberId}
                      </Link>
                    </TableCell>
                    <TableCell>{member.memberName}</TableCell>
                    <TableCell align="right">{member.tithes.toLocaleString()}</TableCell>
                    <TableCell align="right">{member.offerings.toLocaleString()}</TableCell>
                    <TableCell align="right">{member.specialOfferings.toLocaleString()}</TableCell>
                    <TableCell align="right">{member.totalContributions.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Detailed Transaction History */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Transaction History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell align="right">Amount (AED)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {financialData.transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.reference}</TableCell>
                    <TableCell>
                      <Link to={`/members/${transaction.memberId}`}>
                        {transaction.memberId}
                      </Link>
                    </TableCell>
                    <TableCell>{transaction.memberName}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell align="right">{transaction.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Receipt Generation Button */}
      <Box mt={2}>
        <Button
          variant="contained"
          onClick={() => handleGenerateReceipts()}
        >
          Generate Member Contribution Receipts
        </Button>
      </Box>
    </Box>
  );
};

// Add a function to handle receipt generation
const handleGenerateReceipts = () => {
  // Implementation for generating individual receipts for members
};

export default FinancialStatementReport; 