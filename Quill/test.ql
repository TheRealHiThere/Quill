
have min_1 := 1
have max_1 := 10

while min_1 <= max_1 {
	CSInfo(min_1)
	 have min_1 := min_1 + 1
}

# array test [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# This is a function named "async test" that takes two parameters, "min" and "max".
# func async test (min, max) {

#     # If "min" is greater than "max", then calculate the result as 0.
# 	if min > max {
# 		have result := 0
# 		return result
# 	  # Print the result using the CSDebug function.
# 		CSDebug(result)
# 	} 
  
#     # If "min" is less than "max", then calculate the result as the difference between "max" and "min".
# 	elif min < max {
# 		have result := max - min
		
# 	  # Print the result using the CSWarn function.
# 		CSWarn(result)
# 	} 
  
#     # If "min" is equal to "max", then calculate the result as the sum of "min" and the difference between "max" and "min".
# 	else {
# 		have result := min + (max - min)
		
# 	  # Print the result using the CSInfo function.
# 		CSInfo(result)
# 	}
# }

# test(min_1, max_1)
