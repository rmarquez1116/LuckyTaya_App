import React, { useState } from "react"

const TablesV2 = ({ headers,title, items, primaryId, isCentered = false }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10
    const totalPages = Math.ceil(items.length / pageSize)

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    const paginatedItems = items.slice(start, end)

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handlePageClick = page => {
        setCurrentPage(page)
    }

    // Function to generate page numbers with ellipses
    const getPaginationRange = () => {
        const range = []
        const maxVisiblePages = 3 // Maximum number of page buttons to show
        let startPage, endPage

        if (totalPages <= maxVisiblePages) {
            startPage = 1
            endPage = totalPages
        } else {
            if (currentPage <= maxVisiblePages) {
                startPage = 1
                endPage = maxVisiblePages
            } else if (currentPage + 1 >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1
                endPage = totalPages
            } else {
                startPage = currentPage - 1
                endPage = currentPage + 1
            }
        }

        // Add ellipsis if necessary
        if (startPage > 1) {
            range.push(1)
            if (startPage > 2) range.push("...")
        }
        for (let i = startPage; i <= endPage; i++) {
            range.push(i)
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) range.push("...")
            range.push(totalPages)
        }

        return range
    }

    const pageNumbers = getPaginationRange()

    const populateItem = (i, h, item) => {
        const className = `p-3 font-semibold ${h.customValueClass ? h.customValueClass : ''} ${isCentered ? 'text-center' : ''}`
        let value = item[h.key]

        if (h.concatKey) {
            h.concatKey.forEach((concateKeyIndex) => {
                if (item[concateKeyIndex]) {
                    if (concateKeyIndex == "reason") {
                        value = `${value}\n${item[concateKeyIndex]}`
                    } else {
                        value = `${value}${h.concatSeparator}${item[concateKeyIndex]}`
                    }
                }
            })
        }

        let showFormatCustom

        if (h.format) {
            showFormatCustom = h.format(value)
        } else if (h.customValue) {
            showFormatCustom = h.customValue(item)
        }
        if (h.isTitle) {
            return <td colSpan={headers.length} key={`row-key-${h.key}-${i}`} className={className} style={{ whiteSpace: 'pre' }}>{showFormatCustom ?? value}</td>
        }

        return <td colSpan={h.isTitle?headers.length : 1} key={`row-key-${h.key}-${i}`} className={className} style={{ whiteSpace: 'pre' }}>{showFormatCustom ?? value}</td>

    }

    return (
        <div className="justify-between">
            <div className="overflow-x-auto max-w-full">

                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            {headers.map(h => (
                                <th
                                    key={`h-${h.key}`}
                                    className="bg-green text-[12px] text-black font-semibold p-3"
                                >
                                    {h.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedItems.map((item, i) => (
                            <React.Fragment>
                                <tr
                                    key={`key-${item[primaryId]}-${i}`}
                                    className="even:bg-gray13 odd:bg-cursedBlack text-xs"
                                >
                                    {populateItem(i,title,item)}
                                </tr>
                                <tr
                                    key={`key-${item[primaryId]}-${i}`}
                                    className="even:bg-gray13 odd:bg-cursedBlack text-xs"
                                >
                                    {headers.map(h => populateItem(i, h, item))}
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="hover:bg-[#3A3A3A] hover:text-white bg-[#080808] border border-[#3A3A3A] text-[#C4CDD5] py-2 px-4 rounded"
                >
                    &lt;
                </button>

                {pageNumbers.map((number, index) => (
                    <button
                        key={`pg-num-${number}-${index}`}
                        onClick={() => {
                            if (typeof number === "number") {
                                handlePageClick(number)
                            }
                        }}
                        className={`py-2 px-4 rounded border border-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white ${currentPage === number
                            ? "bg-[#3A3A3A] text-white"
                            : "bg-[#080808] text-[#C4CDD5]"
                            }`}
                        // Disable button for ellipses
                        disabled={typeof number === "string"}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="hover:bg-[#3A3A3A] hover:text-white bg-[#080808] border border-[#3A3A3A] text-[#C4CDD5] py-2 px-4 rounded"
                >
                    &gt;
                </button>
            </div>
        </div>
    )
}

export default TablesV2
