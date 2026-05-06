import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMemo } from "react";
import { Row, Col, Spin, Alert } from "antd";
import { Column } from "../components/column/Column";
import { useGetTasksBoardByIdQuery } from "../../boards/api/boards.api";

export const ListTasks = () => {
    const {boardId} = useParams<{boardId: string}>();
    const { data, isLoading, error } = useGetTasksBoardByIdQuery(boardId!);
    const navigate = useNavigate();
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }, []);

    useEffect(() => {
        if (!isLoading && data?.length === 0) {
            const timer = setTimeout(() => {
                navigate(`/boards/${boardId}/tasks/create`); 
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [error, navigate, boardId]);

    const columns = useMemo(() => {
        return {
            todo: data?.filter(t => t.workflow?.code === "todo") ?? [],
            progress: data?.filter(t => t.workflow?.code === "progress") ?? [],
            done: data?.filter(t => t.workflow?.code === "done") ?? [],
        }
    }, [data])

    if (isLoading) {
        return <Spin size="large" style={{ marginTop: 100 }} />;
    }

    return(
        <>
            <hr />
            <div style={{ padding: 40 }}>
                <Row gutter={16} align="top">

                    <Col span={8}>
                        <Column title="Todo" color="#f0f0f0" tasks={columns.todo ?? []} />
                    </Col>

                    <Col span={8}>
                        <Column title="In Progress" color="#e6f4ff" tasks={columns.progress ?? []} />
                    </Col>

                    <Col span={8}>
                        <Column title="Done" color="#f6ffed" tasks={columns.done ?? []} />
                    </Col>
                </Row>
            </div>
            <hr />
        </>
    )
}
