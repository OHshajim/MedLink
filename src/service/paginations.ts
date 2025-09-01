export const handlePrevPage = ({page,setPage}) => {
    if (page > 1) setPage(page - 1);
};
export const handleNextPage = ({ page, totalPages ,setPage}) => {
    if (page < (totalPages || 1)) setPage(page + 1);
};
