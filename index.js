
//使用add()增加内容
const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
console.log(s);

//几种遍历方法
// 由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log('keys', item);
}

for (let item of set.values()) {
  console.log('values', item);
}
// entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等。
for (let item of set.entries()) {   
  console.log('entries', item);
}

// 使用set和数组的filter方法
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
console.log('并集', union);

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
console.log('交集', intersect);

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
console.log('差集', difference);


//Map
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false

//可以接受数组作为构造函数的参数
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"

// 实际上执行了这样的算法
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map1 = new Map();

items.forEach(
  ([key, value]) => map1.set(key, value)
);

//Set和Map类型的数据结构也可以作为构造函数的参数
const set1 = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set1);
console.log(m1.get('foo')) // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
console.log(m3.get('baz')) // 3

//只有对同一个对象的引用，Map 结构才将其视为同一个键
const map2 = new Map();

map2.set(['a'], 555);
console.log('map2', map2.get(['a'])) // undefined

const map3 = new Map();
const _arr = ['a'];
map3.set(_arr, 555);
console.log('map3', map3.get(_arr)) // 555
