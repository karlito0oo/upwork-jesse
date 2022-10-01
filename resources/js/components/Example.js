import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query'
import axios from 'axios';
import DataTable from 'react-data-table-component-footer';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';

function Example() {
    const date = new Date();
    const [filterDate, setFilterDate] = useState(date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2));
    
    const {isLoading, data, refetch} = useQuery('reservations', () => {
        return axios.get(`/api/reservations/${filterDate}`);
    })
    const reservations = data?.data;


    useEffect( ()=>{
        refetch();
        console.log(data?.data);
    } , [filterDate] )
    
    const footer = {
        netIncome: "$"+reservations?.totalIncome,
        fareAccommodation: "$"+reservations?.totalAccomFare,
        fareCleaning: "$"+reservations?.totalCleanFare,
        totalTaxes: "$"+reservations?.totalTax,
        fareAccommodationAdjustment: "$"+reservations?.totalAdj,
        hostServiceFee: "$"+reservations?.totalHostFee,
        balanceDue: "$"+reservations?.totalBalanceDue,
        totalPaid: "$"+reservations?.totalPaid,
      };

    const columns = [
        {
            name: "LISTING'S NICKNAME",
            selector: row => row.listingNickname,
            sortable: true,
        },
        {
            name: "CHECK IN",
            selector: row => row.checkIn,
            sortable: true,
        },
        {
            name: "CHECK OUT",
            selector: row => row.checkOut,
            sortable: true,
        },
        {
            name: "NIGHTS",
            selector: row => row.nights,
            sortable: true,
        },
        {
            name: "GUEST'S NAME",
            selector: row => row?.guest?.fullName,
            sortable: true,
        },
        {
            name: "SOURCE",
            selector: row => row?.source,
            sortable: true,
        },
        {
            name: "CREATION DATE",
            selector: row => row?.creationDate,
            sortable: true,
        },
        {
            name: "NET INCOME",
            selector: row => row?.netIncome,
            sortable: true,
        },
        {
            name: "CONF DATE",
            selector: row => row?.confDate,
            sortable: true,
        },
        {
            name: "ACCOM FARE",
            selector: row => row?.fareAccommodation,
            sortable: true,
        },
        {
            name: "CLEAN FARE",
            selector: row => row?.fareCleaning,
            sortable: true,
        },
        {
            name: "TAX",
            selector: row => row?.totalTaxes,
            sortable: true,
        },
        {
            name: "ADJ",
            selector: row => row?.fareAccommodationAdjustment,
            sortable: true,
        },
        {
            name: "DISC",
            selector: row => row?.fareAccommodationDiscount,
            sortable: true,
        },
        {
            name: "CNCL FEE",
            selector: row => '',
            sortable: true,
        },
        {
            name: "HOST FEE",
            selector: row => row?.hostServiceFee,
            sortable: true,
        },
        {
            name: "BALANCE DUE",
            selector: row => row?.balanceDue,
            sortable: true,
        },
        {
            name: "TOTAL PAID",
            selector: row => row?.totalPaid,
            sortable: true,
        },
    ]

    if(isLoading){
        return (<h3>Loading ....</h3>);
    }

    return (
        <>
            <DataTable columns={columns} data={reservations?.data} pagination fixedHeader 
                subHeader
                subHeaderAlign='left'
                subHeaderComponent={
                    <Form.Group className="mb-3">
                        <Form.Label>Filter</Form.Label>
                        <Form.Control type="month" className="form-control" defaultValue={"2022-09"}
                            onChange = {(e) => {
                                setFilterDate(e.target.value);
                            }}
                        />
                    </Form.Group>
                }
                footer={footer}
                fixedHeaderScrollHeight="300px"
                noHeader
            />
            <Stack gap={3}>
                <Stack direction='horizontal' style={{paddingLeft: "5%"}}>
                    <Stack gap>
                        <p style={{color:"gray"}}>Subtotal Aerie</p>
                        <h3>{'$' + reservations?.subtotalAerie}</h3>
                    </Stack>
                    <Stack>
                        <p style={{color:"gray"}}>Aerie (non AirBnb Revenue)</p>
                        <h3>{'$' + reservations?.subtotalAerieNotAirBnb}</h3>
                    </Stack>
                </Stack>
                <Stack direction='horizontal' style={{paddingLeft: "5%"}}>
                    <Stack>
                        <p style={{color:"gray"}}>Subtotal 20260</p>
                        <h3>{'$' + reservations?.subtotal20260}</h3>
                    </Stack>
                    <Stack>
                        <p style={{color:"gray"}}>Aeirie Sales Tax</p>
                        <h3>{'$' + reservations?.aerieSalesTax}</h3>
                    </Stack>
                </Stack>
                <Stack direction='horizontal' style={{paddingLeft: "5%"}}>
                    <Stack>
                        <p style={{color:"gray"}}>Subtotal 304</p>
                        <h3>{'$' + reservations?.subtotal304}</h3>
                    </Stack>
                    <Stack>
                        <p style={{color:"gray"}}>Aeirie Surtax</p>
                        <h3>{'$' + reservations?.aerieSurTax}</h3>
                    </Stack>
                </Stack>
                <Stack direction='horizontal' style={{paddingLeft: "5%"}}>
                    <Stack>
                        <p style={{color:"gray"}}>Total</p>
                        <h3>{'$' + reservations?.total}</h3>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
}

export default Example;
const queryClient = new QueryClient();
if (document.getElementById('example')) {
    ReactDOM.render(<QueryClientProvider client={queryClient}><Example /></QueryClientProvider>, document.getElementById('example'));
}
