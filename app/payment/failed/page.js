import MainLayout from "../../layout/mainLayout";
import Image from "next/image";
import BalanceHeader from '../../components/balanceHeader'
import failed from '../../../public/images/fail.png'
export default function Failed() {
    return (
        <MainLayout>
            <BalanceHeader type={2}></BalanceHeader>
            <div className="flex flex-col items-center gap-10 justify-center align-center  p-6 mt-5">
                <label>Failed</label>
                <Image alt='failed'  src={failed}></Image>
                <label>Insufficient Amount</label>
            </div>
        </MainLayout >
    );
}
