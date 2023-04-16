exports.getCustomersToSave = (data) => {
    try {
        let customers = [];
        data.forEach(item => {
            let customer = {
                customerId: item['ID'],
                fullName: item['FullName'],
                // name: item['Name'],
                // family: item['Famaly'],
                address: item['Address'],
                city: item['City'],
                phone1: item['Phone 1'],				
                phone2: item['Phone 2'],
                phone3: item['Phone 3'],
                arrivedFrom: item['Arrived from'],
                issueDate: !isNaN(Date.parse(item['issue date'])) ? item['issue date'] : new Date(),
                // hasTicket: item['hasTicket'],  // there is dedicated bach to run after loading
                remark: item['remark'],
            }

            customers.push(customer);
        });

        return customers;

    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.getTicketsToSave = (data) => {
    try {
        let tickets = [];
        data.forEach(item => {
            if(!(item['Ticket ID'])) return;
            let ticket = {
                ticketId: item['Ticket ID'],
                ticketStatus: item['TicketStatus'],
                customerId: item['customer ID'],                				
                customerName: item['CustomerName'],                				
                item: item['item'],
                entryCondition: item['Entry Condition'],
                accessories: item['accessories'],
                defectDescription: item['Defect Description'],
                prepaid: item['pre-paied'],
                prepaidInvoice: item['Pre-paied Invoice'],
                vat: item['vat'],
                invoice: item['Invoice'],
                total: item['total'],
                year: item['Year'],
                entryDate: !isNaN(Date.parse(item['Entry Date'])) ? item['Entry Date'] : null,
                // fixDate: !isNaN(Date.parse(item['fix date'])) ? item['fix date'] : ('0000-00-00'),
                fixDate: !isNaN(Date.parse(item['fix date'])) ? item['fix date'] : null,
                // exitDate: !isNaN(Date.parse(item['Exit date'])) ? item['Exit date'] : ('0000-00-00'),
                exitDate: !isNaN(Date.parse(item['Exit date'])) ? item['Exit date'] : null,
                remarks: item['Remarks'],
            }

            tickets.push(ticket);
        });

        return tickets;

    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.getTablesToSave = (data) => {
    try {
        let tables = [];
        data.forEach(item => {
            let table = {
                table_id: item['ID'],
                table_code: item['CODE'],
                description: item['description'],
                numeric: item['numeric'],
            }

            tables.push(table);
        });

        return tables;

    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.getDefectsToSave = (data) => {
    try {
        let allList = [];
        data.forEach(item => {
            let table = {
                ticketId: item['ticketId'],
                type: item['type'],
                id: item['id'],
                description: item['description'],
            }

            allList.push(table);
        });

        let filteredList = allList.filter((value, index, self) =>
            index === self.findIndex((t) => ( t.ticketId === value.ticketId))
        )

        filteredList = filteredList.map((item) => {
            let defectFound = allList.filter((item1) => {
                return ((item.ticketId === item1.ticketId) && (item1.type ===1))
            }).map((item2) => {
                return(item2.description)
            })

            let defectFixes = allList.filter((item1) => {
                return ((item.ticketId === item1.ticketId) && (item1.type ===2))
            }).map((item2) => {
                return(item2.description)
            })

            return ({ticketId:item.ticketId, defectFound, defectFixes})
        })

        return filteredList;

    } catch (error) {
        console.log(error)
        throw error;
    }
}