import React, { useState, useEffect } from 'react';
import { Table, Header, Segment, Dropdown, Input, Grid, Pagination, GridColumn, Icon, Popup } from 'semantic-ui-react';

const ListCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortingOption, setSortingOption] = useState('date');
    const [sortingOrder, setSortingOrder] = useState('ascending');
    const customersPerPage = 20;

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/customers?sortBy=${sortingOption}&sortOrder=${sortingOrder}&query=${search}`);
                const jsonData = await response.json();
                setCustomers(jsonData.data);
                setTotalPages(Math.ceil(jsonData.data.length / customersPerPage));
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        };

        fetchCustomers();
    }, [search, sortingOption, sortingOrder]);

    const sortingOptions = [
        { key: 'date', text: 'Sort by Date', value: 'date' },
        { key: 'time', text: 'Sort by Time', value: 'time' },
    ];

    const handleSortingOption = (e, { value }) => {
        setSortingOption(value);
    };

    const handleSortingOrder = () => {
        const newSortingOrder = sortingOrder === 'ascending' ? 'descending' : 'ascending';
        setSortingOrder(newSortingOrder);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handlePaginationChange = (e, { activePage }) => {
        setActivePage(activePage);
    };
    const formatDate = (datetimeString) => {
        const date = new Date(datetimeString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [time] = timeString.split('.');
        const [hours, minutes, seconds] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    };
    const displayedCustomers = customers.slice(
        (activePage - 1) * customersPerPage,
        activePage * customersPerPage
    );


    return (
        <div>
            <Segment as='h3' inverted color='violet' textAlign='center'>
                <Header as='h3'>Customer Records</Header>
            </Segment>
            <Segment raised>
                <Grid columns={3}>
                    <Grid.Column>
                        <Input
                            fluid
                            icon='search'
                            placeholder="Search by location or name..."
                            onChange={handleSearchChange}
                            value={search}
                        />
                    </Grid.Column>
                    <GridColumn></GridColumn>
                    <Grid.Column textAlign='right'>
                        <Popup
                            trigger={
                                <Icon
                                    name={sortingOrder === 'descending' ? 'sort content ascending' : 'sort content descending'}
                                    onClick={handleSortingOrder}
                                />
                            }
                            content={`Sort ${sortingOrder === 'descending' ? 'ascending' : 'descending'}`}
                            offset={[0, 10]}
                            position='left center'
                        />
                        <Dropdown
                            placeholder='Sort by...'
                            selection
                            options={sortingOptions}
                            value={sortingOption}
                            onChange={handleSortingOption}
                        />

                    </Grid.Column>
                </Grid>
                <Table celled selectable color={'violet'} striped structured>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell rowSpan='2'>S.No</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Customer Name</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Age</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Phone</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Location</Table.HeaderCell>
                            <Table.HeaderCell colSpan='3'>Created At</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row textAlign='center'>

                            <Popup
                                trigger={
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                }
                                content='dd-mm-yyyy'
                                offset={[0, 3]}
                                position='top center'
                                size='tiny'
                            />
                            <Popup
                                trigger={
                                    <Table.HeaderCell>Time</Table.HeaderCell>
                                }
                                content='hh:mm:ss'
                                offset={[0, 3]}
                                position='top center'
                                size='tiny'
                            />
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {displayedCustomers.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan="7" textAlign='center'>No records found</Table.Cell>
                            </Table.Row>
                        ) : (
                            displayedCustomers.map((customer, index) => (
                                <Table.Row key={customer.sno} textAlign='center'>
                                    <Table.Cell>{(activePage - 1) * customersPerPage + index + 1}</Table.Cell>
                                    <Table.Cell>{customer.customer_name}</Table.Cell>
                                    <Table.Cell>{customer.age}</Table.Cell>
                                    <Table.Cell>{customer.phone}</Table.Cell>
                                    <Table.Cell>{customer.location}</Table.Cell>
                                    <Table.Cell>{formatDate(customer.date)}</Table.Cell>
                                    <Table.Cell>{formatTime(customer.time)}</Table.Cell>
                                </Table.Row>
                            ))
                        )}

                    </Table.Body>
                </Table>
                {totalPages > 1 && (
                    <Segment textAlign='center'>
                        <Pagination
                            activePage={activePage}
                            totalPages={totalPages}
                            onPageChange={handlePaginationChange}
                            textAlign='center'
                        />
                    </Segment>
                )}
            </Segment>
        </div>
    );
};

export default ListCustomers;
