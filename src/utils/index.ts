/*
    Why Merge Sort?  Always O(n log n) for consistent performance showcases 
    Recursive divide-and-conquer approach

    For use cases (likely <100 items), even a basic sort would work, but
    implementing Merge Sort will demonstrate: Understanding of algorithmic complexity(O(N))
    Recursive problem solving
 */

export const mergeSort = <T>(
  array: T[],
  compareFn: (a: T, b: T) => number
): T[] => {
  if (array.length <= 1) return array;

  const middleIndex = Math.floor(array.length / 2);
  // sort left hand side
  const leftHandSide = mergeSort(array.slice(0, middleIndex), compareFn);
  // sort right hand side
  const rightHandSide = mergeSort(array.slice(middleIndex), compareFn);

  return merge(leftHandSide, rightHandSide, compareFn);
};

const merge = <T>(
  leftArray: T[],
  rightArray: T[],
  compareFn: (a: T, b: T) => number
): T[] => {
  // Initialize the result array
  const result: T[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // while the indexes are not at the end of the arrays
  while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
    // Compare item at left index from left hand side array to item at right index from right hand side array
    if (compareFn(leftArray[leftIndex], rightArray[rightIndex]) <= 0) {
      // left item was smaller or equal then add it to result and increment left index
      result.push(leftArray[leftIndex++]);
    } else {
      // right item was smaller then add it to result and increment right index
      result.push(rightArray[rightIndex++]);
    }
  }

  // combine remaining elements from both the left and right hand side arrays since the merging has completed
  return result
    .concat(leftArray.slice(leftIndex))
    .concat(rightArray.slice(rightIndex));
};
