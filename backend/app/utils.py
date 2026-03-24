def calculate_performance(marks: list[int]):
    total = sum(marks)
    percentage = (total / (len(marks) * 100)) * 100 if marks else 0
    
    if percentage >= 90:
        grade = "O"
    elif percentage >= 80:
        grade = "A+"
    elif percentage >= 70:
        grade = "A"
    elif percentage >= 60:
        grade = "B+"
    elif percentage >= 50:
        grade = "B"
    elif percentage >= 40:
        grade = "C"
    else:
        grade = "F"
        
    return total, percentage, grade
