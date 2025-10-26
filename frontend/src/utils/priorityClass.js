export function getPriorityClass(priority) {
    const classMap = {
        'Prioridade Máxima': 'priority-max',
        'Alta Prioridade': 'priority-high',
        'Prioridade Média': 'priority-medium',
        'Baixa Prioridade': 'priority-low',
        'Não Recomendado': 'priority-none'
    }
    return classMap[priority] || ''
}