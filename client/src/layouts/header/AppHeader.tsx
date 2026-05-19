import { useNavigate, Link } from "react-router-dom";
import { Header } from "antd/es/layout/layout"
import { Button } from "antd";
import { useAuth } from "../../feachers/auth/context/AuthContext";
import styles from "./styles.module.scss"
import { useCreateAction } from "../../hooks/UseCreateAction";

export const AppHeader = () => {

    const { isAuth, logout } = useAuth();
    const navigate = useNavigate();
    const {createPath} = useCreateAction();

    return(
        <>
            <Header className={styles.header}>
                <div className={styles.logo}>
                    <Link to="/boards">Task Manager</Link>
                </div>
                <nav className={styles.header__navigation}>
                    <Button type="primary" onClick={() => navigate(createPath)}>Create</Button>

                    {isAuth ? (
                        <Button onClick={logout}>Log out</Button>
                        ) : (
                        <Link to="/login">
                            <Button type="primary">Log in</Button>
                        </Link>
                    )}
                </nav>
                    
            </Header>
        </>
    )
}
