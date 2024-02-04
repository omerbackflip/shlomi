const moment = require('moment');

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
                issueDate: !isNaN(Date.parse(item['issue date'])) ? moment(item['issue date']).add(1,'days') : new Date(),
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
                amount: item['amount'],
                vat: item['vat'],
                total: item['total'],
                invoice: item['Invoice'],
                year: item['Year'],
                entryDate: !isNaN(Date.parse(item['Entry Date'])) ? moment(item['Entry Date']).add(1,'days') : null,
                fixDate: !isNaN(Date.parse(item['fix date'])) ? moment(item['fix date']).add(1,'days') : null,
                exitDate: !isNaN(Date.parse(item['Exit date'])) ? moment(item['Exit date']).add(1,'days') : null,
                remarks: item['Remarks'],
                fixTime: item['fixTime'],
                partsCost: item['partsCost'],
            }

            tickets.push(ticket);
        });

        return tickets;

    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.getTicketsNewToSave = (data) => {
    try {
        let tickets = [];
        data.forEach(item => {
            if(!(item['Ticket ID'])) return;
            let ticket = {
                ticketId: item['ticketId'],
                ticketStatus: item['ticketStatus'],
                customerId: item['customerId'],                				
                customerName: item['customerName'],                				
                item: item['item'],
                entryCondition: item['entryCondition'],
                accessories: item['accessories'],
                defectDescription: item['defectDescription'],
                defectFound: item[defectFound],
                defectFixes: item[defectFixes],
                prepaid: item['prepaid'],
                prepaidInvoice: item['prepaidInvoice'],
                amount: item['amount'],
                vat: item['vat'],
                total: item['total'],
                invoice: item['invoice'],
                year: item['year'],
                entryDate: !isNaN(Date.parse(item['entryDate'])) ? moment(item['Entry Date']).add(1,'days') : null,
                fixDate: !isNaN(Date.parse(item['fixDate'])) ? moment(item['fix date']).add(1,'days') : null,
                exitDate: !isNaN(Date.parse(item['exitDate'])) ? moment(item['Exit date']).add(1,'days') : null,
                remarks: item['remarks'],
                ticketRemark: item['ticketRemark'],
                fixHour: item['fixHour'],
                fixMin: item['fixMin'],
                partsCost: item['partsCost'],
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

exports.getFixTimeToSave = (data) => {
    try {
        let fixTimeArray = [];
        data.forEach(item => {
            let fixTime = {
                ticketId: item['ticketId'],
                fixHour: item['fixHour'],
                fixMin: item['fixMin'],
            }

            fixTimeArray.push(fixTime);
        });

        return fixTimeArray;

    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.getPhonesToSave = (data) => {
    try {
        let phones = [];
        data.forEach(item => {
            let phone = {
                fullName: item['FULLNAME'],
                address: item['ADDRESS'],
                phone1: item['PHONE1'],				
                phone2: item['PHONE2'],
                phone3: item['PHONE3'],
                phone4: item['PHONE4'],
                phoneType: item['PHONETYPE'],
                remark: item['REMARK'],
            }

            phones.push(phone);
        });

        return phones;

    } catch (error) {
        console.log(error)
        throw error;
    }
}