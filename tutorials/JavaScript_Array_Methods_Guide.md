# JavaScript Array Methods: Map, Filter, and Reduce - Step-by-Step Tutorial

## Table of Contents
1. [Getting Started: What Are Array Methods?](#getting-started-what-are-array-methods)
2. [Understanding Arrays First](#understanding-arrays-first)
3. [The Filter Method - Step by Step](#the-filter-method---step-by-step)
4. [The Map Method - Step by Step](#the-map-method---step-by-step)
5. [The Reduce Method - Step by Step](#the-reduce-method---step-by-step)
6. [Combining Methods - Building Complexity](#combining-methods---building-complexity)
7. [Real-World Applications with DOM](#real-world-applications-with-dom)
8. [Final Project - Building Your Skills](#final-project---building-your-skills)

---

## Getting Started: What Are Array Methods?

### Think of Arrays Like a Shopping List

Imagine you have a shopping list:
```javascript
const shoppingList = ["apples", "bread", "milk", "eggs", "cheese"];
```

Sometimes you want to:
- **Filter**: "Show me only dairy products" → `["milk", "cheese"]`
- **Map**: "Add 'buy' before each item" → `["buy apples", "buy bread", "buy milk", "buy eggs", "buy cheese"]`
- **Reduce**: "Count how many items I need" → `5`

### Why These Methods Are Amazing

#### Before Array Methods (The Old Way):
```javascript
// To get items longer than 4 characters
const longItems = [];
for (let i = 0; i < shoppingList.length; i++) {
    if (shoppingList[i].length > 4) {
        longItems.push(shoppingList[i]);
    }
}
```

#### With Array Methods (The New Way):
```javascript
// Same result, much cleaner!
const longItems = shoppingList.filter(item => item.length > 4);
```

### Key Benefits:
1. **Shorter Code**: Less typing, fewer bugs
2. **Clearer Intent**: You can see what you're trying to do immediately
3. **No Side Effects**: Original array stays unchanged
4. **Chainable**: You can connect multiple operations

---

## Understanding Arrays First

### What is an Array?
An array is like a container that holds multiple items in order:

```javascript
// A simple array of numbers
const numbers = [1, 2, 3, 4, 5];

// An array of strings
const fruits = ["apple", "banana", "orange"];

// An array of objects (more complex data)
const students = [
    { name: "Alice", age: 20, grade: 85 },
    { name: "Bob", age: 22, grade: 92 },
    { name: "Charlie", age: 19, grade: 78 }
];
```

### Array Positions (Index)
Arrays have numbered positions starting from 0:

```javascript
const colors = ["red", "green", "blue"];
//              0      1       2

console.log(colors[0]); // "red"
console.log(colors[1]); // "green" 
console.log(colors[2]); // "blue"
```

### Common Array Properties
```javascript
const animals = ["cat", "dog", "bird"];

console.log(animals.length);     // 3 (how many items)
console.log(animals[0]);         // "cat" (first item)
console.log(animals[animals.length - 1]); // "bird" (last item)
```

---

## The Filter Method - Step by Step

### What Does Filter Do?
Filter is like a security guard at a club - it only lets certain people (array elements) through based on rules you set.

### The Basic Pattern
```javascript
const newArray = originalArray.filter(function(item) {
    // Return true to keep the item
    // Return false to remove the item
    return condition;
});
```

### Step 1: Understanding the Callback Function

Let's break down what happens inside filter:

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

// Long form - easier to understand
const evenNumbers = numbers.filter(function(number) {
    console.log("Checking number:", number);
    const isEven = number % 2 === 0;
    console.log("Is", number, "even?", isEven);
    return isEven;
});

console.log("Original array:", numbers);    // [1, 2, 3, 4, 5, 6]
console.log("Filtered array:", evenNumbers); // [2, 4, 6]
```

#### What Happens Step by Step:
1. Filter looks at number `1`: `1 % 2 === 0` → `false` → Don't include
2. Filter looks at number `2`: `2 % 2 === 0` → `true` → Include
3. Filter looks at number `3`: `3 % 2 === 0` → `false` → Don't include
4. Filter looks at number `4`: `4 % 2 === 0` → `true` → Include
5. Filter looks at number `5`: `5 % 2 === 0` → `false` → Don't include
6. Filter looks at number `6`: `6 % 2 === 0` → `true` → Include

### Step 2: Shorter Syntax (Arrow Functions)

Once you understand the concept, you can write it shorter:

```javascript
// Same result, shorter code
const evenNumbers = numbers.filter(number => number % 2 === 0);
```

### Step 3: Simple Examples to Practice

#### Example 1: Filter Numbers
```javascript
const ages = [12, 18, 21, 16, 25, 17, 30, 14];

// Step-by-step breakdown
console.log("=== Finding Adults (18+) ===");
const adults = ages.filter(function(age) {
    console.log(`Is ${age} >= 18?`, age >= 18);
    return age >= 18;
});

console.log("All ages:", ages);          // [12, 18, 21, 16, 25, 17, 30, 14]
console.log("Adult ages:", adults);       // [18, 21, 25, 30]
```

#### Example 2: Filter Strings
```javascript
const names = ["Alice", "Bob", "Alexander", "Charlie", "Amanda"];

// Find names starting with 'A'
console.log("=== Finding Names Starting with 'A' ===");
const aNames = names.filter(function(name) {
    const startsWithA = name.startsWith('A');
    console.log(`Does ${name} start with A?`, startsWithA);
    return startsWithA;
});

console.log("All names:", names);        // ["Alice", "Bob", "Alexander", "Charlie", "Amanda"]
console.log("A names:", aNames);         // ["Alice", "Alexander", "Amanda"]
```

### Step 4: Working with Objects

Objects are like boxes with labels:
```javascript
const person = {
    name: "Alice",
    age: 25,
    job: "Developer"
};
```

#### Example: Filter Students by Grade
```javascript
const students = [
    { name: "Alice", grade: 85, subject: "Math" },
    { name: "Bob", grade: 92, subject: "Science" },
    { name: "Charlie", grade: 78, subject: "Math" },
    { name: "Diana", grade: 96, subject: "Science" }
];

// Find students with grade above 80
console.log("=== Finding High-Performing Students ===");
const topStudents = students.filter(function(student) {
    console.log(`${student.name} has grade ${student.grade}`);
    const isTopStudent = student.grade > 80;
    console.log(`Is ${student.name} a top student?`, isTopStudent);
    return isTopStudent;
});

console.log("All students:", students);
console.log("Top students:", topStudents);
// Result: Alice, Bob, Diana (Charlie has 78, which is not > 80)
```

### Step 5: Multiple Conditions

Sometimes you need to check multiple things:

```javascript
const products = [
    { name: "Laptop", price: 999, category: "Electronics", inStock: true },
    { name: "Phone", price: 699, category: "Electronics", inStock: false },
    { name: "Book", price: 15, category: "Education", inStock: true },
    { name: "Headphones", price: 199, category: "Electronics", inStock: true }
];

// Find available electronics under $800
console.log("=== Finding Affordable Available Electronics ===");
const affordableElectronics = products.filter(function(product) {
    // Check each condition
    const isElectronics = product.category === "Electronics";
    const isAffordable = product.price < 800;
    const isAvailable = product.inStock === true;
    
    console.log(`${product.name}:`);
    console.log(`  - Is Electronics? ${isElectronics}`);
    console.log(`  - Is under $800? ${isAffordable}`);
    console.log(`  - Is in stock? ${isAvailable}`);
    
    // ALL conditions must be true
    const meetsAllCriteria = isElectronics && isAffordable && isAvailable;
    console.log(`  - Meets all criteria? ${meetsAllCriteria}`);
    
    return meetsAllCriteria;
});

console.log("Matching products:", affordableElectronics);
// Result: Only Headphones (Phone is out of stock, Laptop is over $800)
```

### Practice Exercises for Filter

#### Exercise 1: Simple Number Filtering
**Your Task**: Filter out negative numbers from this array:
```javascript
const temperatures = [-5, 12, -3, 0, 8, -1, 15, 22];
```

**Steps to Follow**:
1. Create a variable to hold the result
2. Use the `filter` method
3. Inside the callback function, check if the number is greater than or equal to 0
4. Log both the original and filtered arrays

**Expected Result**: `[12, 0, 8, 15, 22]`

#### Exercise 2: Text Filtering
**Your Task**: Find all words that are longer than 5 characters:
```javascript
const words = ["cat", "elephant", "dog", "butterfly", "ant", "giraffe"];
```

**Hint**: Use the `.length` property to check string length

#### Exercise 3: Object Filtering Challenge
**Your Task**: Filter employees who work in "Marketing" department:
```javascript
const employees = [
    { name: "John", department: "Engineering", salary: 70000 },
    { name: "Sarah", department: "Marketing", salary: 65000 },
    { name: "Mike", department: "Engineering", salary: 75000 },
    { name: "Emma", department: "Marketing", salary: 68000 },
    { name: "David", department: "Sales", salary: 60000 }
];
```

**Steps**:
1. Use filter method
2. Check if `employee.department` equals "Marketing"
3. Console.log each step to see what's happening

---

## The Map Method - Step by Step

### What Does Map Do?
Map is like a factory assembly line - it takes each item, transforms it according to your instructions, and gives you back a new item. The new array has the same number of items as the original.

### The Basic Pattern
```javascript
const newArray = originalArray.map(function(item) {
    // Transform the item somehow
    // Return the new version
    return transformedItem;
});
```

### Step 1: Understanding Transformation

Think of map as "converting" each item:

```javascript
const numbers = [1, 2, 3, 4, 5];

// Transform each number by doubling it
console.log("=== Doubling Each Number ===");
const doubled = numbers.map(function(number) {
    console.log(`Original: ${number}`);
    const doubledNumber = number * 2;
    console.log(`Doubled: ${doubledNumber}`);
    return doubledNumber;
});

console.log("Original array:", numbers);  // [1, 2, 3, 4, 5]
console.log("Doubled array:", doubled);   // [2, 4, 6, 8, 10]
```

#### What Happens Step by Step:
1. Map looks at `1` → transform to `1 * 2 = 2` → add `2` to new array
2. Map looks at `2` → transform to `2 * 2 = 4` → add `4` to new array
3. Map looks at `3` → transform to `3 * 2 = 6` → add `6` to new array
4. Map looks at `4` → transform to `4 * 2 = 8` → add `8` to new array
5. Map looks at `5` → transform to `5 * 2 = 10` → add `10` to new array

### Step 2: Different Types of Transformations

#### Example 1: Numbers to Strings
```javascript
const scores = [85, 92, 78, 96];

console.log("=== Converting Scores to Grades ===");
const grades = scores.map(function(score) {
    console.log(`Score: ${score}`);
    let grade;
    
    if (score >= 90) {
        grade = "A";
    } else if (score >= 80) {
        grade = "B";  
    } else if (score >= 70) {
        grade = "C";
    } else {
        grade = "F";
    }
    
    console.log(`Grade: ${grade}`);
    return grade;
});

console.log("Original scores:", scores);  // [85, 92, 78, 96]
console.log("Letter grades:", grades);    // ["B", "A", "C", "A"]
```

#### Example 2: Strings to Objects
```javascript
const names = ["Alice", "Bob", "Charlie"];

console.log("=== Creating User Objects ===");
const users = names.map(function(name) {
    console.log(`Processing name: ${name}`);
    
    const userObject = {
        id: Math.random(), // Simple random ID
        name: name,
        email: name.toLowerCase() + "@email.com",
        isActive: true
    };
    
    console.log("Created user:", userObject);
    return userObject;
});

console.log("Original names:", names);
console.log("User objects:", users);
```

### Step 3: Working with Objects

When you have an array of objects, you can transform them in many ways:

```javascript
const products = [
    { name: "Laptop", price: 999, category: "Electronics" },
    { name: "Book", price: 15, category: "Education" },
    { name: "Phone", price: 699, category: "Electronics" }
];

// Example 1: Add discount price
console.log("=== Adding Discount Prices ===");
const productsWithDiscount = products.map(function(product) {
    console.log(`Processing: ${product.name} ($${product.price})`);
    
    const discountedProduct = {
        name: product.name,
        originalPrice: product.price,
        discountPrice: product.price * 0.9, // 10% discount
        category: product.category,
        savings: product.price * 0.1
    };
    
    console.log(`New price: $${discountedProduct.discountPrice}`);
    return discountedProduct;
});

console.log("Products with discount:", productsWithDiscount);
```

### Step 4: Extracting Specific Properties

Sometimes you want just one piece of information from each object:

```javascript
const students = [
    { name: "Alice", age: 20, grade: 85, city: "New York" },
    { name: "Bob", age: 22, grade: 92, city: "Boston" },
    { name: "Charlie", age: 19, grade: 78, city: "Chicago" }
];

// Extract just the names
console.log("=== Extracting Student Names ===");
const studentNames = students.map(function(student) {
    console.log(`Extracting name from:`, student);
    return student.name;
});

console.log("Just the names:", studentNames); // ["Alice", "Bob", "Charlie"]

// Extract just the grades
console.log("=== Extracting Student Grades ===");
const studentGrades = students.map(function(student) {
    return student.grade;
});

console.log("Just the grades:", studentGrades); // [85, 92, 78]
```

### Step 5: Complex Transformations

You can create completely new data structures:

```javascript
const orders = [
    { id: 1, customer: "Alice", items: 3, total: 150 },
    { id: 2, customer: "Bob", items: 1, total: 75 },
    { id: 3, customer: "Charlie", items: 5, total: 300 }
];

console.log("=== Creating Order Summaries ===");
const orderSummaries = orders.map(function(order) {
    console.log(`Processing order ${order.id} for ${order.customer}`);
    
    const averageItemPrice = order.total / order.items;
    const orderSummary = {
        orderNumber: `ORD-${order.id.toString().padStart(3, '0')}`, // ORD-001
        customerName: order.customer.toUpperCase(),
        description: `${order.items} items totaling $${order.total}`,
        averageItemPrice: averageItemPrice.toFixed(2),
        isLargeOrder: order.total > 200
    };
    
    console.log("Created summary:", orderSummary);
    return orderSummary;
});

console.log("Order summaries:", orderSummaries);
```

### Practice Exercises for Map

#### Exercise 4: Temperature Conversion
**Your Task**: Convert temperatures from Celsius to Fahrenheit:
```javascript
const celsiusTemps = [0, 20, 30, 100, -10];
```

**Formula**: `(celsius * 9/5) + 32`

**Steps**:
1. Use the map method
2. Apply the formula to each temperature
3. Return the converted temperature

**Expected Result**: `[32, 68, 86, 212, 14]`

#### Exercise 5: Creating Full Names
**Your Task**: Combine first and last names:
```javascript
const people = [
    { firstName: "John", lastName: "Doe" },
    { firstName: "Jane", lastName: "Smith" },
    { firstName: "Mike", lastName: "Johnson" }
];
```

**Hint**: Use template literals: `` `${firstName} ${lastName}` ``

#### Exercise 6: Product Card Creation
**Your Task**: Create display cards for products:
```javascript
const inventory = [
    { name: "MacBook", price: 1299, stock: 5 },
    { name: "iPhone", price: 999, stock: 12 },
    { name: "AirPods", price: 179, stock: 25 }
];
```

**Create objects with**:
- `displayName`: Product name in uppercase
- `priceTag`: Price formatted as "$1,299.00"
- `availability`: "In Stock" or "Low Stock" (if stock < 10)

---

## The Reduce Method - Step by Step

### What Does Reduce Do?
Reduce is like a blender - it takes all your array items and blends them into one single result. Unlike map and filter which return arrays, reduce returns one value.

### The Basic Pattern
```javascript
const result = originalArray.reduce(function(accumulator, currentItem) {
    // Do something with accumulator and currentItem
    // Return the updated accumulator
    return updatedAccumulator;
}, initialValue);
```

### Step 1: Understanding the Accumulator

The accumulator is like a running total that gets updated each time:

```javascript
const numbers = [1, 2, 3, 4, 5];

console.log("=== Adding All Numbers ===");
const sum = numbers.reduce(function(accumulator, currentNumber) {
    console.log(`Current accumulator: ${accumulator}`);
    console.log(`Current number: ${currentNumber}`);
    const newAccumulator = accumulator + currentNumber;
    console.log(`New accumulator: ${newAccumulator}`);
    console.log("---");
    return newAccumulator;
}, 0); // Start with 0

console.log("Final sum:", sum); // 15
```

#### What Happens Step by Step:
1. Start with accumulator = 0 (initial value)
2. Look at 1: accumulator (0) + current (1) = 1 → accumulator becomes 1
3. Look at 2: accumulator (1) + current (2) = 3 → accumulator becomes 3  
4. Look at 3: accumulator (3) + current (3) = 6 → accumulator becomes 6
5. Look at 4: accumulator (6) + current (4) = 10 → accumulator becomes 10
6. Look at 5: accumulator (10) + current (5) = 15 → final result is 15

### Step 2: Different Types of Accumulation

#### Example 1: Finding the Maximum
```javascript
const scores = [85, 92, 78, 96, 88];

console.log("=== Finding Highest Score ===");
const highestScore = scores.reduce(function(maxSoFar, currentScore) {
    console.log(`Current max: ${maxSoFar}, checking: ${currentScore}`);
    
    if (currentScore > maxSoFar) {
        console.log(`${currentScore} is higher! New max: ${currentScore}`);
        return currentScore;
    } else {
        console.log(`${maxSoFar} is still the highest`);
        return maxSoFar;
    }
}, 0); // Start with 0

console.log("Highest score:", highestScore); // 96
```

#### Example 2: Counting Items
```javascript
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

console.log("=== Counting Each Fruit ===");
const fruitCount = fruits.reduce(function(counts, currentFruit) {
    console.log(`Current counts:`, counts);
    console.log(`Processing: ${currentFruit}`);
    
    // If we've seen this fruit before, add 1 to its count
    if (counts[currentFruit]) {
        counts[currentFruit] = counts[currentFruit] + 1;
    } else {
        // If this is the first time seeing this fruit, set count to 1
        counts[currentFruit] = 1;
    }
    
    console.log(`Updated counts:`, counts);
    console.log("---");
    return counts;
}, {}); // Start with empty object

console.log("Final fruit count:", fruitCount);
// Result: { apple: 3, banana: 2, orange: 1 }
```

### Step 3: Working with Objects

#### Example 1: Calculate Total Revenue
```javascript
const sales = [
    { product: "Laptop", quantity: 2, price: 999 },
    { product: "Phone", quantity: 5, price: 699 },
    { product: "Tablet", quantity: 3, price: 399 }
];

console.log("=== Calculating Total Revenue ===");
const totalRevenue = sales.reduce(function(total, sale) {
    console.log(`Current total: $${total}`);
    console.log(`Processing: ${sale.product}`);
    
    const saleRevenue = sale.quantity * sale.price;
    console.log(`${sale.quantity} × $${sale.price} = $${saleRevenue}`);
    
    const newTotal = total + saleRevenue;
    console.log(`New total: $${newTotal}`);
    console.log("---");
    
    return newTotal;
}, 0);

console.log("Total revenue:", totalRevenue); // $6,694
```

#### Example 2: Group Data by Category
```javascript
const expenses = [
    { description: "Groceries", amount: 50, category: "Food" },
    { description: "Gas", amount: 30, category: "Transport" },
    { description: "Restaurant", amount: 25, category: "Food" },
    { description: "Movie ticket", amount: 15, category: "Entertainment" },
    { description: "Bus fare", amount: 5, category: "Transport" }
];

console.log("=== Grouping Expenses by Category ===");
const expensesByCategory = expenses.reduce(function(groups, expense) {
    console.log(`Current groups:`, groups);
    console.log(`Processing: ${expense.description} ($${expense.amount}) - ${expense.category}`);
    
    const category = expense.category;
    
    // If this category doesn't exist yet, create it
    if (!groups[category]) {
        groups[category] = [];
        console.log(`Created new category: ${category}`);
    }
    
    // Add this expense to the category
    groups[category].push(expense);
    console.log(`Added to ${category}:`, expense);
    console.log("---");
    
    return groups;
}, {});

console.log("Expenses by category:", expensesByCategory);
```

### Step 4: More Complex Examples

#### Example: Customer Analysis
```javascript
const customers = [
    { name: "Alice", orders: 5, totalSpent: 500, type: "Premium" },
    { name: "Bob", orders: 2, totalSpent: 150, type: "Regular" },
    { name: "Charlie", orders: 8, totalSpent: 800, type: "Premium" },
    { name: "Diana", orders: 1, totalSpent: 75, type: "Regular" }
];

console.log("=== Analyzing Customer Data ===");
const customerAnalysis = customers.reduce(function(analysis, customer) {
    console.log(`Analyzing customer: ${customer.name}`);
    console.log(`Current analysis:`, analysis);
    
    // Update total customers
    analysis.totalCustomers++;
    
    // Update total revenue
    analysis.totalRevenue += customer.totalSpent;
    
    // Update total orders
    analysis.totalOrders += customer.orders;
    
    // Count by customer type
    if (customer.type === "Premium") {
        analysis.premiumCustomers++;
    } else {
        analysis.regularCustomers++;
    }
    
    // Track highest spender
    if (customer.totalSpent > analysis.highestSpender.amount) {
        analysis.highestSpender = {
            name: customer.name,
            amount: customer.totalSpent
        };
    }
    
    console.log(`Updated analysis:`, analysis);
    console.log("---");
    
    return analysis;
}, {
    totalCustomers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    premiumCustomers: 0,
    regularCustomers: 0,
    highestSpender: { name: "", amount: 0 }
});

// Calculate averages
customerAnalysis.averageOrderValue = customerAnalysis.totalRevenue / customerAnalysis.totalOrders;
customerAnalysis.averageSpentPerCustomer = customerAnalysis.totalRevenue / customerAnalysis.totalCustomers;

console.log("Final customer analysis:", customerAnalysis);
```

### Practice Exercises for Reduce

#### Exercise 7: Calculate Average
**Your Task**: Calculate the average grade:
```javascript
const grades = [85, 92, 78, 96, 88, 79, 90, 87];
```

**Steps**:
1. Use reduce to sum all grades
2. Divide by the array length
3. Return the average

#### Exercise 8: Find Oldest Person
**Your Task**: Find the person with the highest age:
```javascript
const people = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 28 },
    { name: "Diana", age: 35 }
];
```

**Hint**: Compare ages and keep track of the oldest person object

#### Exercise 9: Word Length Counter
**Your Task**: Count total characters in all words:
```javascript
const words = ["hello", "world", "javascript", "programming"];
```

**Hint**: Use the length property of each string and add them up

---

## Combining Methods - Building Complexity

### Why Combine Methods?
Real-world problems often require multiple steps. Instead of writing separate code for each step, you can chain array methods together like building blocks.

### Step 1: Understanding Chaining

Think of chaining like a factory assembly line:
1. **Raw materials** → Filter (quality control) → **Good materials**
2. **Good materials** → Map (transform) → **Finished products**  
3. **Finished products** → Reduce (package) → **Final result**

```javascript
const students = [
    { name: "Alice", grades: [85, 90, 92], subject: "Math" },
    { name: "Bob", grades: [78, 85, 88], subject: "Science" },
    { name: "Charlie", grades: [92, 95, 98], subject: "Math" },
    { name: "Diana", grades: [88, 90, 85], subject: "English" }
];

// Goal: Find the average grade of Math students
console.log("=== Step-by-Step Chaining ===");

// Step 1: Filter Math students
const mathStudents = students.filter(student => {
    console.log(`Is ${student.name} a Math student?`, student.subject === "Math");
    return student.subject === "Math";
});
console.log("Math students:", mathStudents);

// Step 2: Calculate each student's average
const mathAverages = mathStudents.map(student => {
    const sum = student.grades.reduce((total, grade) => total + grade, 0);
    const average = sum / student.grades.length;
    console.log(`${student.name}'s average:`, average);
    return average;
});
console.log("Individual averages:", mathAverages);

// Step 3: Calculate overall average
const overallAverage = mathAverages.reduce((total, avg) => total + avg, 0) / mathAverages.length;
console.log("Overall Math average:", overallAverage);
```

### Step 2: Chaining in One Line

Once you understand each step, you can chain them:

```javascript
// Same result, one chain
const mathAverage = students
    .filter(student => student.subject === "Math")
    .map(student => student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length)
    .reduce((total, avg) => total + avg, 0) / students.filter(s => s.subject === "Math").length;

console.log("Chained result:", mathAverage);
```

### Step 3: Real-World Examples

#### Example 1: E-commerce Sales Analysis
```javascript
const orders = [
    { id: 1, customer: "Alice", items: [{ name: "Laptop", price: 999, qty: 1 }], status: "completed" },
    { id: 2, customer: "Bob", items: [{ name: "Mouse", price: 25, qty: 2 }, { name: "Keyboard", price: 75, qty: 1 }], status: "completed" },
    { id: 3, customer: "Charlie", items: [{ name: "Monitor", price: 299, qty: 1 }], status: "pending" },
    { id: 4, customer: "Alice", items: [{ name: "Phone", price: 699, qty: 1 }], status: "completed" }
];

console.log("=== E-commerce Analysis ===");

// Goal: Total revenue from completed orders
const completedRevenue = orders
    .filter(order => {
        console.log(`Order ${order.id} status:`, order.status);
        return order.status === "completed";
    })
    .map(order => {
        const orderTotal = order.items.reduce((total, item) => {
            const itemTotal = item.price * item.qty;
            console.log(`${item.name}: $${item.price} × ${item.qty} = $${itemTotal}`);
            return total + itemTotal;
        }, 0);
        console.log(`Order ${order.id} total: $${orderTotal}`);
        return orderTotal;
    })
    .reduce((total, orderTotal) => {
        console.log(`Adding $${orderTotal} to total of $${total}`);
        return total + orderTotal;
    }, 0);

console.log("Total completed revenue:", completedRevenue);
```

#### Example 2: Employee Performance Report
```javascript
const employees = [
    { name: "John", department: "Sales", sales: [1000, 1200, 800, 1500], rating: 4.2 },
    { name: "Sarah", department: "Sales", sales: [1100, 1300, 900, 1600], rating: 4.5 },
    { name: "Mike", department: "Engineering", sales: [], rating: 4.0 },
    { name: "Emma", department: "Sales", sales: [800, 900, 700, 1200], rating: 3.8 },
    { name: "David", department: "Marketing", sales: [], rating: 4.1 }
];

console.log("=== Top Sales Performers ===");

// Goal: Find top-performing sales people (rating > 4.0 and total sales > 4000)
const topPerformers = employees
    .filter(employee => {
        console.log(`Checking ${employee.name}:`);
        console.log(`  Department: ${employee.department}`);
        console.log(`  Rating: ${employee.rating}`);
        
        const isSales = employee.department === "Sales";
        const hasGoodRating = employee.rating > 4.0;
        const qualifies = isSales && hasGoodRating;
        
        console.log(`  Qualifies for sales check: ${qualifies}`);
        return qualifies;
    })
    .map(employee => {
        const totalSales = employee.sales.reduce((total, sale) => total + sale, 0);
        console.log(`${employee.name} total sales: $${totalSales}`);
        
        return {
            name: employee.name,
            rating: employee.rating,
            totalSales: totalSales,
            averageSale: totalSales / employee.sales.length,
            performance: totalSales > 4000 ? "Excellent" : "Good"
        };
    })
    .filter(performer => {
        console.log(`${performer.name} has $${performer.totalSales} in sales`);
        return performer.totalSales > 4000;
    });

console.log("Top performers:", topPerformers);
```

### Step 4: Debugging Chained Methods

When chaining gets complex, break it down:

```javascript
const products = [
    { name: "Laptop", price: 999, category: "Electronics", reviews: [5, 4, 5, 3, 4] },
    { name: "Book", price: 15, category: "Education", reviews: [4, 4, 5] },
    { name: "Phone", price: 699, category: "Electronics", reviews: [5, 5, 4, 5] },
    { name: "Pen", price: 2, category: "Office", reviews: [3, 4, 3] }
];

// Goal: Average rating of Electronics over $500
console.log("=== Debugging Chain Step by Step ===");

// Step 1: Filter Electronics
const electronics = products.filter(product => {
    const isElectronics = product.category === "Electronics";
    console.log(`${product.name} is electronics: ${isElectronics}`);
    return isElectronics;
});
console.log("Electronics:", electronics.map(p => p.name));

// Step 2: Filter expensive items
const expensiveElectronics = electronics.filter(product => {
    const isExpensive = product.price > 500;
    console.log(`${product.name} ($${product.price}) is expensive: ${isExpensive}`);
    return isExpensive;
});
console.log("Expensive electronics:", expensiveElectronics.map(p => p.name));

// Step 3: Calculate average ratings
const ratings = expensiveElectronics.map(product => {
    const avgRating = product.reviews.reduce((sum, rating) => sum + rating, 0) / product.reviews.length;
    console.log(`${product.name} average rating: ${avgRating}`);
    return avgRating;
});
console.log("Individual ratings:", ratings);

// Step 4: Overall average
const overallRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
console.log("Overall average rating:", overallRating);

// Now as one chain:
const chainedResult = products
    .filter(product => product.category === "Electronics")
    .filter(product => product.price > 500)
    .map(product => product.reviews.reduce((sum, rating) => sum + rating, 0) / product.reviews.length)
    .reduce((sum, rating) => sum + rating, 0) / products
        .filter(product => product.category === "Electronics" && product.price > 500).length;

console.log("Chained result:", chainedResult);
```

### Practice Exercises for Chaining

#### Exercise 10: Student Grade Analysis
**Your Task**: Find students with average grade above 85 and return their names
**Data**:
```javascript
const studentData = [
    { name: "Alice", grades: [88, 92, 85, 90], year: "Senior" },
    { name: "Bob", grades: [76, 78, 82, 80], year: "Junior" },
    { name: "Charlie", grades: [95, 92, 98, 94], year: "Senior" },
    { name: "Diana", grades: [82, 85, 87, 84], year: "Sophomore" }
];
```

**Steps**:
1. Map each student to include their average grade
2. Filter students with average > 85
3. Map to extract just their names

#### Exercise 11: Inventory Management
**Your Task**: Find total value of low-stock electronics
**Data**:
```javascript
const inventory = [
    { name: "Laptop", price: 999, stock: 3, category: "Electronics" },
    { name: "Book", price: 15, stock: 50, category: "Education" },
    { name: "Phone", price: 699, stock: 2, category: "Electronics" },
    { name: "Desk", price: 299, stock: 8, category: "Furniture" },
    { name: "Tablet", price: 399, stock: 1, category: "Electronics" }
];
```

**Steps**:
1. Filter electronics items
2. Filter items with stock < 5 (low stock)
3. Map to calculate total value (price × stock)
4. Reduce to sum all values

**Expected Process**: Electronics → Low stock → Calculate values → Sum total

---

## Real-World Applications with DOM

### Setting Up HTML for Our Examples

Before we start, you'll need basic HTML structure:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Array Methods Practice</title>
    <style>
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .filter-section { margin: 20px 0; }
        .product-card { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Array Methods in Action</h1>
        <div id="app"></div>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

### Application 1: Product Filter System

Let's build a product filtering system step by step:

#### Step 1: Basic Setup and Data Display

```javascript
// Sample product data
const products = [
    { id: 1, name: "MacBook Pro", price: 1299, category: "Electronics", rating: 4.5, inStock: true },
    { id: 2, name: "iPhone 14", price: 999, category: "Electronics", rating: 4.7, inStock: true },
    { id: 3, name: "Office Chair", price: 199, category: "Furniture", rating: 4.2, inStock: false },
    { id: 4, name: "Desk Lamp", price: 45, category: "Furniture", rating: 4.0, inStock: true },
    { id: 5, name: "Wireless Mouse", price: 29, category: "Electronics", rating: 4.3, inStock: true },
    { id: 6, name: "Coffee Table", price: 299, category: "Furniture", rating: 4.1, inStock: true }
];

// Get the container where we'll display everything
const appContainer = document.getElementById('app');

// Function to create HTML for a single product
function createProductHTML(product) {
    return `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
            <p>Rating: ${product.rating}/5</p>
            <p>Stock: ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
        </div>
    `;
}

// Function to display products
function displayProducts(productsToShow) {
    console.log("Displaying products:", productsToShow);
    
    // Use map to convert each product to HTML
    const productHTML = productsToShow
        .map(product => {
            console.log("Creating HTML for:", product.name);
            return createProductHTML(product);
        })
        .join(''); // Join all HTML strings together
    
    // Update the page
    appContainer.innerHTML = `
        <h2>Products (${productsToShow.length} found)</h2>
        ${productHTML}
    `;
}

// Initial display - show all products
displayProducts(products);
```

#### Step 2: Adding Category Filter

```javascript
// Add filter controls to the page
function setupFilterControls() {
    const filterHTML = `
        <div class="filter-section">
            <h3>Filters</h3>
            <select id="categoryFilter" class="input">
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
            </select>
            <input type="number" id="maxPrice" placeholder="Max Price" class="input">
            <button id="applyFilters" class="button">Apply Filters</button>
            <button id="clearFilters" class="button">Clear Filters</button>
        </div>
        <div id="productResults"></div>
    `;
    
    appContainer.innerHTML = filterHTML;
}

// Function to apply filters
function applyFilters() {
    console.log("=== Applying Filters ===");
    
    // Get filter values
    const selectedCategory = document.getElementById('categoryFilter').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    console.log("Selected category:", selectedCategory || "All");
    console.log("Max price:", maxPrice || "No limit");
    
    // Start with all products
    let filteredProducts = products;
    
    // Apply category filter if selected
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => {
            const matches = product.category === selectedCategory;
            console.log(`${product.name} category (${product.category}) matches ${selectedCategory}: ${matches}`);
            return matches;
        });
        console.log("After category filter:", filteredProducts.length, "products");
    }
    
    // Apply price filter if specified
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(product => {
            const matches = product.price <= parseInt(maxPrice);
            console.log(`${product.name} price ($${product.price}) <= $${maxPrice}: ${matches}`);
            return matches;
        });
        console.log("After price filter:", filteredProducts.length, "products");
    }
    
    // Display filtered results
    displayFilteredProducts(filteredProducts);
}

// Function to display filtered products
function displayFilteredProducts(products) {
    const resultsContainer = document.getElementById('productResults');
    
    if (products.length === 0) {
        resultsContainer.innerHTML = '<p>No products match your criteria.</p>';
        return;
    }
    
    const productHTML = products
        .map(product => createProductHTML(product))
        .join('');
    
    resultsContainer.innerHTML = `
        <h3>Found ${products.length} products:</h3>
        ${productHTML}
    `;
}

// Set up the page
setupFilterControls();

// Add event listeners
document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('productResults').innerHTML = '';
});

// Show all products initially
displayFilteredProducts(products);
```

### Application 2: Shopping Cart with Calculations

#### Step 1: Cart Setup

```javascript
// Shopping cart data
let cartItems = [
    { id: 1, name: "Laptop", price: 999, quantity: 1 },
    { id: 2, name: "Mouse", price: 25, quantity: 2 },
    { id: 3, name: "Keyboard", price: 75, quantity: 1 }
];

// Available items to add
const availableItems = [
    { id: 4, name: "Monitor", price: 299 },
    { id: 5, name: "Speakers", price: 89 },
    { id: 6, name: "Webcam", price: 129 }
];

// Function to calculate item subtotal
function calculateSubtotal(item) {
    const subtotal = item.price * item.quantity;
    console.log(`${item.name}: $${item.price} × ${item.quantity} = $${subtotal}`);
    return subtotal;
}

// Function to create cart item HTML
function createCartItemHTML(item) {
    const subtotal = calculateSubtotal(item);
    
    return `
        <div class="product-card" data-item-id="${item.id}">
            <h4>${item.name}</h4>
            <p>Price: $${item.price} each</p>
            <p>
                Quantity: 
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </p>
            <p><strong>Subtotal: $${subtotal}</strong></p>
            <button onclick="removeItem(${item.id})" class="button" style="background: #dc3545;">Remove</button>
        </div>
    `;
}

// Function to display cart
function displayCart() {
    console.log("=== Displaying Cart ===");
    console.log("Current cart items:", cartItems);
    
    if (cartItems.length === 0) {
        appContainer.innerHTML = '<h2>Your cart is empty</h2>';
        return;
    }
    
    // Use map to create HTML for each item
    const cartHTML = cartItems
        .map(item => {
            console.log("Creating HTML for cart item:", item.name);
            return createCartItemHTML(item);
        })
        .join('');
    
    // Calculate totals using reduce
    const totalItems = cartItems.reduce((total, item) => {
        console.log(`Adding ${item.quantity} items to total of ${total}`);
        return total + item.quantity;
    }, 0);
    
    const totalPrice = cartItems.reduce((total, item) => {
        const itemTotal = calculateSubtotal(item);
        console.log(`Adding $${itemTotal} to total of $${total}`);
        return total + itemTotal;
    }, 0);
    
    // Display everything
    appContainer.innerHTML = `
        <h2>Shopping Cart</h2>
        ${cartHTML}
        <div style="border-top: 2px solid #000; padding: 20px; margin-top: 20px;">
            <h3>Cart Summary</h3>
            <p>Total Items: ${totalItems}</p>
            <p><strong>Total Price: $${totalPrice}</strong></p>
        </div>
    `;
}

// Function to update quantity
function updateQuantity(itemId, change) {
    console.log(`Updating quantity for item ${itemId} by ${change}`);
    
    // Use map to update the specific item
    cartItems = cartItems.map(item => {
        if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            console.log(`${item.name} quantity: ${item.quantity} → ${newQuantity}`);
            
            // Don't let quantity go below 1
            return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
    });
    
    displayCart(); // Refresh display
}

// Function to remove item
function removeItem(itemId) {
    console.log(`Removing item with ID: ${itemId}`);
    
    // Use filter to remove the item
    const originalLength = cartItems.length;
    cartItems = cartItems.filter(item => {
        const keep = item.id !== itemId;
        if (!keep) {
            console.log(`Removing: ${item.name}`);
        }
        return keep;
    });
    
    console.log(`Cart size: ${originalLength} → ${cartItems.length}`);
    displayCart(); // Refresh display
}

// Initial display
displayCart();
```

### Practice Projects

#### Project 1: Employee Management System
**Your Task**: Create an employee directory with filtering and statistics

**Features to Implement**:
- Display all employees
- Filter by department
- Filter by salary range
- Show department statistics (average salary, employee count)
- Search by name

**HTML Elements Needed**:
- Department dropdown
- Salary range inputs (min/max)
- Search input
- Statistics display area
- Employee list container

**Array Methods to Use**:
- `filter()` for department and salary filtering
- `map()` to create employee display cards
- `reduce()` to calculate statistics

**Hints**:
1. Start with displaying all employees
2. Add one filter at a time
3. Use `reduce()` to group employees by department
4. Calculate averages using sum/count pattern

#### Project 2: Sales Dashboard
**Your Task**: Create a sales analytics dashboard

**Data Structure**:
```javascript
const salesData = [
    { salesperson: "Alice", month: "January", sales: 15000, region: "North" },
    { salesperson: "Bob", month: "January", sales: 12000, region: "South" },
    // ... more data
];
```

**Features**:
- Monthly sales totals
- Top performers
- Regional comparisons
- Performance trends

**Implementation Steps**:
1. Create basic data display
2. Add month/region filters
3. Calculate totals and averages
4. Create top performer rankings
5. Add visual indicators (high/low performance)

**Key Learning Points**:
- Use `filter()` for time period and region selection
- Use `map()` to transform raw data into display format
- Use `reduce()` for aggregations (sums, averages, grouping)
- Chain methods for complex calculations

---

## Final Project - Building Your Skills

### Project: Complete Data Management System

Now that you understand each method individually and how to combine them, let's build a comprehensive system that demonstrates everything you've learned.

#### Project Overview: Student Management System

You'll create a complete student management system with multiple features:

1. **Student Directory** - Display and search students
2. **Grade Analytics** - Calculate statistics and performance metrics
3. **Course Management** - Organize students by courses
4. **Performance Dashboard** - Visual indicators and reports

#### Step 1: Data Structure Setup

First, let's understand our data:

```javascript
// Our student database
const students = [
    {
        id: 1,
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.j@school.edu",
        courses: [
            { name: "Mathematics", grade: 88, credits: 3 },
            { name: "Physics", grade: 92, credits: 4 },
            { name: "Chemistry", grade: 85, credits: 3 }
        ],
        year: "Sophomore",
        gpa: 0, // We'll calculate this
        status: "Active"
    },
    {
        id: 2,
        firstName: "Bob",
        lastName: "Smith",
        email: "bob.s@school.edu",
        courses: [
            { name: "Mathematics", grade: 76, credits: 3 },
            { name: "History", grade: 82, credits: 3 },
            { name: "English", grade: 79, credits: 3 }
        ],
        year: "Junior",
        gpa: 0,
        status: "Active"
    },
    {
        id: 3,
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie.b@school.edu",
        courses: [
            { name: "Physics", grade: 95, credits: 4 },
            { name: "Mathematics", grade: 98, credits: 3 },
            { name: "Computer Science", grade: 96, credits: 4 }
        ],
        year: "Senior",
        gpa: 0,
        status: "Active"
    }
    // Add more students for practice
];
```

#### Step 2: Core Calculation Functions

Before building the interface, let's create functions that use our array methods:

```javascript
// Function to calculate GPA for a student
function calculateGPA(student) {
    console.log(`Calculating GPA for ${student.firstName} ${student.lastName}`);
    
    // Use reduce to calculate weighted average
    const totalPoints = student.courses.reduce((total, course) => {
        const gradePoints = course.grade * course.credits;
        console.log(`${course.name}: ${course.grade} × ${course.credits} = ${gradePoints} points`);
        return total + gradePoints;
    }, 0);
    
    const totalCredits = student.courses.reduce((total, course) => {
        return total + course.credits;
    }, 0);
    
    const gpa = totalPoints / totalCredits;
    console.log(`Total: ${totalPoints} points ÷ ${totalCredits} credits = ${gpa.toFixed(2)} GPA`);
    
    return gpa;
}

// Function to update all student GPAs
function updateAllGPAs() {
    console.log("=== Updating All Student GPAs ===");
    
    // Use map to update each student's GPA
    return students.map(student => {
        const updatedStudent = { ...student };
        updatedStudent.gpa = calculateGPA(student);
        return updatedStudent;
    });
}

// Function to get students by year
function getStudentsByYear(year) {
    console.log(`=== Finding ${year} Students ===`);
    
    return students.filter(student => {
        const matches = student.year === year;
        console.log(`${student.firstName} ${student.lastName} is ${student.year}: ${matches}`);
        return matches;
    });
}

// Function to get top performers
function getTopPerformers(minGPA = 3.5) {
    console.log(`=== Finding Students with GPA >= ${minGPA} ===`);
    
    const studentsWithGPA = updateAllGPAs();
    
    return studentsWithGPA
        .filter(student => {
            const qualifies = student.gpa >= minGPA;
            console.log(`${student.firstName} ${student.lastName} GPA: ${student.gpa.toFixed(2)} - Qualifies: ${qualifies}`);
            return qualifies;
        })
        .sort((a, b) => b.gpa - a.gpa); // Sort by GPA descending
}

// Function to analyze course performance
function analyzeCoursePerformance() {
    console.log("=== Analyzing Course Performance ===");
    
    // Use reduce to group all grades by course
    const courseData = students.reduce((courseStats, student) => {
        console.log(`Processing courses for ${student.firstName} ${student.lastName}`);
        
        student.courses.forEach(course => {
            if (!courseStats[course.name]) {
                courseStats[course.name] = {
                    grades: [],
                    totalCredits: 0,
                    studentCount: 0
                };
                console.log(`Created new course: ${course.name}`);
            }
            
            courseStats[course.name].grades.push(course.grade);
            courseStats[course.name].totalCredits += course.credits;
            courseStats[course.name].studentCount += 1;
            
            console.log(`Added grade ${course.grade} to ${course.name}`);
        });
        
        return courseStats;
    }, {});
    
    // Calculate averages for each course
    const courseAnalysis = Object.keys(courseData).map(courseName => {
        const course = courseData[courseName];
        const averageGrade = course.grades.reduce((sum, grade) => sum + grade, 0) / course.grades.length;
        const highestGrade = Math.max(...course.grades);
        const lowestGrade = Math.min(...course.grades);
        
        console.log(`${courseName} Analysis:`);
        console.log(`  Students: ${course.studentCount}`);
        console.log(`  Average: ${averageGrade.toFixed(2)}`);
        console.log(`  Range: ${lowestGrade} - ${highestGrade}`);
        
        return {
            name: courseName,
            studentCount: course.studentCount,
            averageGrade: averageGrade,
            highestGrade: highestGrade,
            lowestGrade: lowestGrade,
            totalCredits: course.totalCredits
        };
    });
    
    return courseAnalysis;
}
```

#### Step 3: Building the Interface

Now let's create the HTML interface step by step:

```javascript
// Function to create the main interface
function createInterface() {
    const appContainer = document.getElementById('app');
    
    appContainer.innerHTML = `
        <div class="container">
            <h1>Student Management System</h1>
            
            <!-- Navigation -->
            <div class="nav-section">
                <button onclick="showAllStudents()" class="button">All Students</button>
                <button onclick="showTopPerformers()" class="button">Top Performers</button>
                <button onclick="showCourseAnalysis()" class="button">Course Analysis</button>
                <button onclick="showSearchInterface()" class="button">Search Students</button>
            </div>
            
            <!-- Display Area -->
            <div id="displayArea">
                <p>Select an option above to get started!</p>
            </div>
        </div>
    `;
}

// Function to display all students
function showAllStudents() {
    console.log("=== Displaying All Students ===");
    
    const studentsWithGPA = updateAllGPAs();
    const displayArea = document.getElementById('displayArea');
    
    // Use map to create HTML for each student
    const studentHTML = studentsWithGPA
        .map(student => {
            // Use map to create course list
            const courseList = student.courses
                .map(course => `<li>${course.name}: ${course.grade}% (${course.credits} credits)</li>`)
                .join('');
            
            return `
                <div class="student-card">
                    <h3>${student.firstName} ${student.lastName}</h3>
                    <p><strong>Year:</strong> ${student.year}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>GPA:</strong> ${student.gpa.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${student.status}</p>
                    <details>
                        <summary>View Courses (${student.courses.length})</summary>
                        <ul>${courseList}</ul>
                    </details>
                </div>
            `;
        })
        .join('');
    
    displayArea.innerHTML = `
        <h2>All Students (${studentsWithGPA.length} total)</h2>
        ${studentHTML}
    `;
}

// Function to show top performers
function showTopPerformers() {
    console.log("=== Displaying Top Performers ===");
    
    const topStudents = getTopPerformers(3.5);
    const displayArea = document.getElementById('displayArea');
    
    if (topStudents.length === 0) {
        displayArea.innerHTML = '<h2>No students found with GPA >= 3.5</h2>';
        return;
    }
    
    const studentHTML = topStudents
        .map((student, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏆';
            
            return `
                <div class="student-card top-performer">
                    <h3>${medal} #${rank} - ${student.firstName} ${student.lastName}</h3>
                    <p><strong>GPA:</strong> ${student.gpa.toFixed(2)}</p>
                    <p><strong>Year:</strong> ${student.year}</p>
                    <p><strong>Courses:</strong> ${student.courses.length}</p>
                </div>
            `;
        })
        .join('');
    
    displayArea.innerHTML = `
        <h2>🌟 Top Performers (GPA ≥ 3.5)</h2>
        ${studentHTML}
    `;
}

// Function to show course analysis
function showCourseAnalysis() {
    console.log("=== Displaying Course Analysis ===");
    
    const courseStats = analyzeCoursePerformance();
    const displayArea = document.getElementById('displayArea');
    
    // Sort courses by average grade
    const sortedCourses = courseStats.sort((a, b) => b.averageGrade - a.averageGrade);
    
    const courseHTML = sortedCourses
        .map(course => {
            const performance = course.averageGrade >= 90 ? 'excellent' : 
                               course.averageGrade >= 80 ? 'good' : 
                               course.averageGrade >= 70 ? 'average' : 'needs-improvement';
            
            return `
                <div class="course-card ${performance}">
                    <h3>${course.name}</h3>
                    <p><strong>Students Enrolled:</strong> ${course.studentCount}</p>
                    <p><strong>Average Grade:</strong> ${course.averageGrade.toFixed(1)}%</p>
                    <p><strong>Grade Range:</strong> ${course.lowestGrade}% - ${course.highestGrade}%</p>
                    <p><strong>Total Credits:</strong> ${course.totalCredits}</p>
                </div>
            `;
        })
        .join('');
    
    displayArea.innerHTML = `
        <h2>📊 Course Performance Analysis</h2>
        ${courseHTML}
    `;
}

// Function to show search interface
function showSearchInterface() {
    const displayArea = document.getElementById('displayArea');
    
    displayArea.innerHTML = `
        <h2>🔍 Search Students</h2>
        <div class="search-controls">
            <input type="text" id="nameSearch" placeholder="Search by name..." class="input">
            <select id="yearFilter" class="input">
                <option value="">All Years</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
            </select>
            <input type="number" id="minGPA" placeholder="Min GPA" step="0.1" class="input">
            <button onclick="performSearch()" class="button">Search</button>
        </div>
        <div id="searchResults"></div>
    `;
}

// Function to perform search
function performSearch() {
    console.log("=== Performing Student Search ===");
    
    const nameQuery = document.getElementById('nameSearch').value.toLowerCase();
    const yearFilter = document.getElementById('yearFilter').value;
    const minGPA = parseFloat(document.getElementById('minGPA').value) || 0;
    
    console.log("Search criteria:", { nameQuery, yearFilter, minGPA });
    
    const studentsWithGPA = updateAllGPAs();
    
    // Chain multiple filters
    const searchResults = studentsWithGPA
        .filter(student => {
            // Name filter
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
            const nameMatch = !nameQuery || fullName.includes(nameQuery);
            
            console.log(`${student.firstName} ${student.lastName} name match:`, nameMatch);
            return nameMatch;
        })
        .filter(student => {
            // Year filter
            const yearMatch = !yearFilter || student.year === yearFilter;
            console.log(`${student.firstName} ${student.lastName} year match:`, yearMatch);
            return yearMatch;
        })
        .filter(student => {
            // GPA filter
            const gpaMatch = student.gpa >= minGPA;
            console.log(`${student.firstName} ${student.lastName} GPA (${student.gpa.toFixed(2)}) >= ${minGPA}:`, gpaMatch);
            return gpaMatch;
        });
    
    const resultsContainer = document.getElementById('searchResults');
    
    if (searchResults.length === 0) {
        resultsContainer.innerHTML = '<p>No students match your search criteria.</p>';
        return;
    }
    
    const resultsHTML = searchResults
        .map(student => `
            <div class="student-card">
                <h4>${student.firstName} ${student.lastName}</h4>
                <p>Year: ${student.year} | GPA: ${student.gpa.toFixed(2)}</p>
            </div>
        `)
        .join('');
    
    resultsContainer.innerHTML = `
        <h3>Search Results (${searchResults.length} found)</h3>
        ${resultsHTML}
    `;
}

// Initialize the application
createInterface();
```

#### Step 4: Adding CSS for Better Presentation

Add this CSS to make your application look professional:

```css
.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.nav-section {
    margin: 20px 0;
    text-align: center;
}

.button {
    background: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px;
    font-size: 14px;
}

.button:hover {
    background: #0056b3;
}

.input {
    padding: 8px;
    margin: 5px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 14px;
}

.student-card, .course-card {
    border: 1px solid #ddd;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    background: #f8f9fa;
}

.top-performer {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    border-color: #d4af37;
}

.course-card.excellent { background: #d4edda; border-color: #28a745; }
.course-card.good { background: #cce5ff; border-color: #007bff; }
.course-card.average { background: #fff3cd; border-color: #ffc107; }
.course-card.needs-improvement { background: #f8d7da; border-color: #dc3545; }

.search-controls {
    background: #e9ecef;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
}

details {
    margin-top: 10px;
}

summary {
    cursor: pointer;
    font-weight: bold;
    color: #007bff;
}
```

### Your Implementation Challenges

Now it's your turn! Here are the challenges to complete:

#### Challenge 1: Grade Distribution Analysis
**Task**: Add a function that shows grade distribution across all courses
**Requirements**:
- Count how many students got A, B, C, D, F grades
- Use reduce to group grades by letter
- Display as percentages

**Hints**:
1. First, collect all grades from all students and courses
2. Use map to convert numeric grades to letter grades
3. Use reduce to count each letter grade
4. Calculate percentages

#### Challenge 2: Student Comparison Tool
**Task**: Create a feature to compare two students side by side
**Requirements**:
- Select two students from dropdowns
- Show their courses, grades, and GPAs
- Highlight who performs better in each course

**Hints**:
1. Create dropdown menus with all student names
2. Use filter to find selected students
3. Use map to create comparison display

#### Challenge 3: Course Recommendations
**Task**: Suggest courses for students based on their performance
**Requirements**:
- Find students struggling in certain subjects (grade < 75)
- Recommend study groups or tutoring
- Show which students excel in each subject

**Hints**:
1. Use filter to find struggling students
2. Use reduce to group students by subjects they struggle with
3. Use filter to find top performers in each subject

#### Challenge 4: Attendance and Performance Correlation
**Task**: Add attendance data and analyze its correlation with grades
**Requirements**:
- Add attendance percentage to each course
- Find correlation between attendance and grades
- Display warnings for low-attendance students

**Data to Add**:
```javascript
// Add this to each course object:
attendance: 85 // percentage
```

### Final Assessment Criteria

Your completed project should demonstrate:

1. **Filter Usage** (25 points):
   - Multiple filtering criteria
   - Complex conditions
   - Proper null/undefined handling

2. **Map Usage** (25 points):
   - Data transformation
   - HTML generation
   - Object restructuring

3. **Reduce Usage** (25 points):
   - Aggregation calculations
   - Data grouping
   - Statistics generation

4. **Method Chaining** (25 points):
   - Multiple methods combined
   - Efficient data flow
   - Clean, readable code

### Bonus Features to Explore

Once you complete the basic requirements, try these advanced features:

1. **Export Functionality**: Generate CSV/PDF reports
2. **Data Visualization**: Add charts using libraries like Chart.js
3. **Real-time Updates**: Add ability to edit student data
4. **Mobile Responsive**: Make it work on phones/tablets
5. **Local Storage**: Save data between sessions

Remember: The goal is not just to make it work, but to understand WHY each array method is the right choice for each task. Always think about which method fits the problem best:

- **Filter**: When you need to select items based on criteria
- **Map**: When you need to transform each item
- **Reduce**: When you need to calculate a single result from all items

Good luck building your Student Management System! 🎓

---

## Best Practices and Common Mistakes

### Do's and Don'ts

#### ✅ DO:
1. **Choose the right method for the job**
2. **Use descriptive variable names**
3. **Keep callbacks simple and focused**
4. **Chain methods logically**
5. **Handle edge cases (empty arrays, null values)**

#### ❌ DON'T:
1. **Modify the original array inside callbacks**
2. **Use reduce when map or filter would be clearer**
3. **Forget to return values from callbacks**
4. **Chain too many methods without clarity**
5. **Ignore performance with very large datasets**

### Performance Tips
1. **Filter before Map**: Reduce the array size first
2. **Use Early Returns**: Exit conditions as soon as possible
3. **Consider Traditional Loops**: For simple operations on large arrays
4. **Cache Expensive Calculations**: Don't recalculate the same values

### Debugging Tips
1. **Use console.log inside callbacks** to see what's happening
2. **Break down complex chains** into separate steps
3. **Check your return values** - missing returns are common bugs
4. **Validate your data** - make sure arrays and objects have expected properties

Congratulations! You now have a comprehensive understanding of JavaScript array methods and how to apply them in real-world scenarios. Practice these concepts regularly, and you'll become proficient in functional programming patterns that are essential for modern JavaScript development.
