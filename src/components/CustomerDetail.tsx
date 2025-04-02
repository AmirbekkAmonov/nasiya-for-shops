import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin, Alert, Dropdown, Menu, Button, Modal, List } from "antd";
import { MoreOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useDebtor from "../hooks/useDebtor";
import useDebts from "../hooks/UseDebts"; 
import "../styles/components/CustomerDetail.scss";

const CustomerDetail = () => {
    const { id } = useParams();
    const { getDebtorById, deleteDebtor } = useDebtor();
    const { debts, loading: debtsLoading, error: debtsError } = useDebts(id!); // Use useDebts to get debts
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
            title: 'Qarzdorni o\'chirishni tasdiqlaysizmi?',
            content: 'Ushbu qarzdor o\'chirilganda, ma\'lumotlar tiklanmaydi.',
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
                            <h3>Debts</h3>
                            {debts.length > 0 ? (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={debts}
                                    renderItem={(debt) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={`Debt: ${debt.debt_sum}`}
                                                description={`Status: ${debt.debt_status}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <p>No debts found for this customer.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetail;
