import MainLayout from "../../layout/mainLayout";
import Image from "next/image";
import BalanceHeader from '../../components/balanceHeader'
import success from '../../../public/images/success.png'

export default function Success() {
    return (
        <MainLayout>
            <BalanceHeader type={2}></BalanceHeader>
            <div className="flex flex-col items-center gap-10 justify-center align-center  p-6 mt-5">
                <label>Successful</label>
                <Image  alt='success'  src={success}></Image>
                <label>The amount has been successfully added to your account</label>
            </div>
        </MainLayout >
    );
}
