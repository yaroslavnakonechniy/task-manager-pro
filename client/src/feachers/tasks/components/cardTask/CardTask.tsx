import { Link } from "react-router-dom"
import { Card, Popconfirm, Tooltip  } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, ArrowLeftOutlined, ArrowRightOutlined, MessageOutlined } from '@ant-design/icons';
import Paragraph from "antd/es/typography/Paragraph";
import type { CardTaskProps } from "../../../../types/cards/taskProps";
import { useDeleteTask } from "../../../../hooks/UseDeleteTask";
import { useUpdateTaskWorkflowMutation } from "../../api/tasks.api"
import type { Workflow } from "../../../../types/workflow.type";

export const CardTask = ({card}: CardTaskProps) => {
    const { performDelete, isDeleting } = useDeleteTask();
    const [updateWorkflow, { isLoading: isUpdating }] = useUpdateTaskWorkflowMutation();

    const handleMove = (newStatus: Workflow['code']) => {
        if (card.id && card.boardId) {
            updateWorkflow({ 
                id: card.id, 
                workflow: newStatus, 
                boardId: card.boardId 
            });
        }
    };

    const statuses = ['todo', 'progress', 'done'] as const;
    const currentIndex = statuses.indexOf(card.workflow);

    const handleDelete = () => {
        if (card.id && card?.boardId) {
            performDelete({ id: card.id, boardId: card.boardId }); 
        }
    };

    return(
        <>
            <Card 
                title={card.title} 
                variant="borderless"
                style={{ margin: '20px 0' }} 
                styles={{
                    header: {
                        backgroundColor: '#f3e3c9',
                        borderBottom: '1px solid #f0f0f0',
                        minHeight: '40px',
                        padding: '0 12px',
                    },
                    title: {
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1890ff',
                    },
                    body: {
                        padding: '12px',
                    }
                }}
                actions={[
                    currentIndex > 0 ? (
                        <Tooltip title="Back" key="back">
                            <ArrowLeftOutlined 
                                style={{ color: 'black' }}
                                disabled={isUpdating}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isUpdating) handleMove(statuses[currentIndex - 1]);
                                }}
                            />
                        </Tooltip>
                    ) : <div key="spacer-left" />,

                    <Link key="view" to={`/tasks/${card.id}`}>
                        <EyeOutlined style={{ color: 'blue' }} />
                    </Link>,

                    <Link key="edit" to={`/tasks/${card.id}/edit`}>
                        <EditOutlined style={{ color: 'black' }} />
                    </Link>,

                    <Link key="edit" to={`/tasks/${card.id}/comments`}>
                        <MessageOutlined style={{ color: 'black' }} />,
                    </Link>,

                    <Popconfirm
                        key="delete"
                        title="Delete task?"
                        description="Are you sure you want to delete this task?"
                        onConfirm={handleDelete}
                        okButtonProps={{ loading: isDeleting }}
                        disabled={isDeleting}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>,

                    currentIndex < statuses.length - 1 ? (
                        <Tooltip title="Next" key="forward">
                            <ArrowRightOutlined 
                                style={{ color: 'black' }}
                                disabled={isUpdating}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isUpdating) handleMove(statuses[currentIndex + 1]);
                                }}
                            />
                        </Tooltip>
                    ) : <div key="spacer-right" />,
                ]} 
            >
                <Paragraph>{card.description}</Paragraph>
            </Card>
        </>
    )
}
