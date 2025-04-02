import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin, Alert, Dropdown, Menu, Button, Modal } from "antd";
import { MoreOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import useDebtor from "../hooks/useDebtor";
import useDebts from "../hooks/UseDebts";
import "../styles/components/CustomerDetail.scss";

const CustomerDetail = () => {
    const { id } = useParams();
    const { getDebtorById, deleteDebtor } = useDebtor();
    const { debts, loading: debtsLoading, error: debtsError } = useDebts(id!);
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomer = async () => {
            if (!id) return;
            setLoading(true);
            const data = await getDebtorById(id);
            if (data) {
                setCustomer(data);
            } else {
                setError("Mijoz topilmadi yoki xatolik yuz berdi.");
            }
            setLoading(false);
        };

        fetchCustomer();
    }, [id]);

    const handleEdit = () => {
        console.log("Edit customer");
    };

    const handleDelete = async () => {
        Modal.confirm({
            title: 'Qarzdorni o‘chirishni tasdiqlaysizmi?',
            content: 'Ushbu qarzdor o‘chirilganda, ma‘lumotlar tiklanmaydi.',
            onOk: async () => {
                const success = await deleteDebtor(id!);
                if (success) {
                    navigate(-1);
                }
            },
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key="edit" onClick={handleEdit} style={{ fontSize: "16px" }}>
                Edit
            </Menu.Item>
            <Menu.Item key="delete" onClick={handleDelete} style={{ color: "red", fontSize: "16px" }}>
                Delete
            </Menu.Item>
        </Menu>
    );

    const handleBack = () => {
        navigate(-1);
    };

    if (error || debtsError) return <Alert message={error || debtsError} type="error" />;
    console.log(debts);

    const activeDebts = debts.filter(debt => debt.debt_status === "active");

    const handleAddDebt = () => {
        navigate(`/add-debt/${id}`);
    };

    return (
        <div className="CustomerDetail">
            <div className="container">
                {loading || debtsLoading ? (
                    <div className="loading">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="customer">
                        <div className="customer__header">
                            <button onClick={handleBack} className="back">
                                <ArrowLeftOutlined style={{ fontSize: "20px" }} />
                            </button>
                            <h2>{customer?.full_name}</h2>
                            <Dropdown overlay={menu} trigger={['click']} className="dropdown">
                                <Button icon={<MoreOutlined />} />
                            </Dropdown>
                        </div>
                        <div className="customer__content">
                            <h3>Faol nasiyalar</h3>
                            {activeDebts.length > 0 ? (
                                <div className="debt-list-container">
                                    {activeDebts.map((debt, index) => {
                                        const createdDate = new Date(debt.created_at).getTime();
                                        const currentDate = new Date().getTime();
                                        const monthlyPayment = Math.abs(Number(debt.total_debt_sum) / Math.max(Number(debt.total_month), 1));
                                        const monthsPassed = Math.min(Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24 * 30)), Number(debt.total_month));
                                        const paidSum = (Number(debt.total_debt_sum) / Number(debt.total_month)) * monthsPassed;
                                        const paidPercentage = Math.max((paidSum / Number(debt.total_debt_sum)) * 100, 1);
                                        const isInvalidDebt = createdDate <= 0 || Number(debt.total_debt_sum) < 0;
                                        return (
                                            <div className="debt-item" key={index} style={isInvalidDebt ? { border: "2px solid red", backgroundColor: "rgba(255, 0, 0, 0.1)" } : {}}>
                                                <div className="debt-item__header">
                                                    <p>{new Date(debt.created_at).toLocaleString("en-US", {
                                                        year: "numeric" as const,
                                                        month: "short" as const,
                                                        day: "numeric" as const,
                                                        hour: "2-digit" as const,
                                                        minute: "2-digit" as const,
                                                        hour12: false
                                                    })}</p>

                                                    <h4>{Math.floor(Number(debt.debt_sum))} <span>so'm</span></h4>
                                                </div>
                                                <div className="debt-item__content">
                                                    <h3>Keyingi to'lov: {new Date(debt.next_payment_date).toLocaleDateString()}</h3>
                                                    <h4>{Math.floor(monthlyPayment)} <span>so'm</span></h4>
                                                    <div className="progress-bar-container">
                                                        <div className="progress-bar" style={{ width: `${paidPercentage}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="no-debt">
                                    <h3>Mijozda hali nasiya mavjud emas</h3>
                                    <p>Nasiya yaratish uchun pastdagi “+” tugmasini bosing</p>
                                </div>
                            )}
                        </div>
                        <button className="add-debt" onClick={handleAddDebt}><PlusOutlined /> Qo'shish</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetail;
