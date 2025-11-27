import React, { useState, useEffect } from 'react';
import { ROTATIONS } from '../logic/rotationPatterns';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortablePlayerItem({ player, index, isStarter }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: player.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1,
        touchAction: 'none' // Important for mobile drag
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="player-card"
        >
            <div style={{
                borderLeft: isStarter ? '4px solid var(--success)' : '4px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)'
            }}>
                <div style={{ marginRight: '1rem', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'grab' }}>
                    ☰
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexGrow: 1 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', width: '20px' }}>{index + 1}</span>
                    <span className="jersey-number" style={{ fontSize: '1.2rem', width: '30px' }}>{player.number}</span>
                    <span className="player-name">{player.firstName}</span>
                    {isStarter && <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--success)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>START</span>}
                </div>
            </div>
        </div>
    );
}

export function GameSetup({ allPlayers, selectedPlayerIds, onToggleSelection, onStartGame, onUpdateOrder }) {
    const [step, setStep] = useState(1); // 1: Select, 2: Order
    const [orderedPlayers, setOrderedPlayers] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Slight delay to prevent accidental drags while scrolling
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        // Sync orderedPlayers with selection
        const currentIds = orderedPlayers.map(p => p.id);
        const newIds = selectedPlayerIds.filter(id => !currentIds.includes(id));
        const removedIds = currentIds.filter(id => !selectedPlayerIds.includes(id));

        let newList = [...orderedPlayers];
        if (removedIds.length > 0) {
            newList = newList.filter(p => !removedIds.includes(p.id));
        }
        if (newIds.length > 0) {
            const newPlayers = allPlayers.filter(p => newIds.includes(p.id));
            newList = [...newList, ...newPlayers];
        }

        setOrderedPlayers(newList);
        onUpdateOrder(newList);
    }, [selectedPlayerIds, allPlayers, onUpdateOrder]); // Added onUpdateOrder to dependency array

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = orderedPlayers.findIndex((p) => p.id === active.id);
            const newIndex = orderedPlayers.findIndex((p) => p.id === over.id);

            const newOrder = arrayMove(orderedPlayers, oldIndex, newIndex);
            setOrderedPlayers(newOrder);
            onUpdateOrder(newOrder);
        }
    };

    const playerCount = orderedPlayers.length;
    const rotation = ROTATIONS[playerCount];
    const startersIndices = rotation ? rotation.matrix.map((row, i) => row[0] === 1 ? i : -1).filter(i => i !== -1) : [];

    return (
        <div className="card">
            <div className="step-indicator">
                <div className={`step-dot ${step === 1 ? 'active' : ''}`} />
                <div className={`step-dot ${step === 2 ? 'active' : ''}`} />
            </div>

            <h2>{step === 1 ? 'Step 1: Select Roster' : 'Step 2: Set Lineup'}</h2>

            {step === 1 && (
                <>
                    <p className="text-sm" style={{ marginBottom: '1.5rem' }}>Select players available for today's game.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '2rem', maxHeight: '50vh', overflowY: 'auto' }}>
                        {allPlayers.map(player => {
                            const isSelected = selectedPlayerIds.includes(player.id);
                            return (
                                <div
                                    key={player.id}
                                    onClick={() => onToggleSelection(player.id)}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: `2px solid ${isSelected ? 'var(--accent-orange)' : 'var(--border-color)'}`,
                                        backgroundColor: isSelected ? 'rgba(245, 132, 38, 0.1)' : 'var(--bg-primary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div className="jersey-number" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{player.number}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{player.firstName}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex-between">
                        <div className="text-sm">Selected: {selectedPlayerIds.length}</div>
                        <button
                            className="btn-primary"
                            disabled={selectedPlayerIds.length < 5}
                            onClick={() => setStep(2)}
                        >
                            Next
                        </button>
                    </div>
                    {selectedPlayerIds.length < 5 && (
                        <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>Need at least 5 players.</p>
                    )}
                </>
            )}

            {step === 2 && (
                <>
                    <p className="text-sm" style={{ marginBottom: '1rem' }}>
                        Drag to reorder.
                        {rotation && <span style={{ color: 'var(--success)', display: 'block', marginTop: '0.5rem' }}>
                            Highlighted players start in Period 1.
                        </span>}
                    </p>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={orderedPlayers.map(p => p.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                                {orderedPlayers.map((player, index) => (
                                    <SortablePlayerItem
                                        key={player.id}
                                        player={player}
                                        index={index}
                                        isStarter={startersIndices.includes(index)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <div className="grid-2">
                        <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                        <button className="btn-primary" onClick={onStartGame}>Tip Off!</button>
                    </div>
                </>
            )}
        </div>
    );
}
