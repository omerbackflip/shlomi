exports.getCustomersToSave = (data) => {
    try {
        let customers = [];
        data.forEach(item => {
            let customer = {
                customerId: item['ID'],
                fullName: item['FullName'],
                name: item['Name'],
                family: item['Famaly'],
                address: item['Address'],
                city: item['City'],
                phone1: item['Phone 1'],				
                phone2: item['Phone 2'],
                phone3: item['Phone 3'],
                arrivedFrom: item['Arrived from'],
                issueDate: !isNaN(Date.parse(item['issue date'])) ? item['issue date'] : new Date(),
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
                itemCode: item['item code'],
                item: item['item'],
                accessories: item['accessories'],
                defectDescription: item['Defect Description'],
                entryCondition: item['Entry Condition'],
                entryDate: !isNaN(Date.parse(item['Entry Date'])) ? item['Entry Date'] : new Date(),
                checkPrice: item['Check Price'],
                defaultFixPrice: item['defulat Fix Price'],
                prepaid: item['pre-paied'],
                prepaidInvoice: item['Pre-paied Invoice'],
                discount: item['Discount %'],
                discountPrice: item['discount Price'],
                vat: item['vat'],
                total: item['total'],
                approved: item['approve'],
                fixDate: !isNaN(Date.parse(item['fix date'])) ? item['fix date'] : new Date(null),
                exitDate: !isNaN(Date.parse(item['Exit date'])) ? item['Exit date'] : new Date(null),
                paid: item['payed'],
                rFinal: item['r final'],
                receipt: item['recipt'],
                invoice: item['Invoice'],
                archive: item['Archive'],
                partsCost: item['parts cost'],
                elapseTime: !isNaN(Date.parse(item['Elapse time'])) ? item['Elapse time'] : new Date(),
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