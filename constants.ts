export const USER_C_CODE = `#include <stdio.h>
int front=-1,back=-1;
int l[25],size=25;
int ENQUEUE(int a);
int DEQUEUE();
int LOC();
int DISPLAY();
int main(){
    int n;
    printf("Enter The size of queue\\n");
    scanf("%d",&size);
    label:
    printf("Enter your choice enqueue-1,dequeue-2,display-3,location of pointers-4 and quit-0\\n");
    scanf("%d",&n);
    if (n==1){
        printf("Enter the element to enqueue \\n");
        scanf("%d",&n);
        ENQUEUE(n);
        goto label;
    }
    else if(n==2){
        DEQUEUE();
        goto label;
    }
    else if(n==3){
        DISPLAY();
        goto label;
    }
    else if(n==4){
        LOC();
        goto label;
    }
    else if(n==0){
        printf("Program Quit\\n");
        return 0;
    }
    else{
        printf("Invalid\\n");
        goto label;
    }
}
int ENQUEUE(int a){
    if (front==-1 && back==-1){
        front++;back++;
        l[back]=a;
    }
    else if(back==size-1){
        printf("The queue is Full-Overflow\\n");
    }
    else{
        back++;
        l[back]=a;
    }
    return 0;
}
int DEQUEUE(){
    if (front==-1){
        printf("The Queue is empty-Underflow\\n");
    }
    else if(front==back){
        front=-1;back=-1;
    }
    else{
        front++;
    }
    return 0;
}
int LOC(){
    printf("The Front pointer is %d and Back pointer %d\\n",front,back);
    return 0;
}
int DISPLAY(){
    if (front==-1){
        printf("The queue is empty\\n");
    }
    else{
        for(int i=front;i<=back;i++){
            printf("%d ",l[i]);
        }
        printf("\\n");
    }
    return 0;
}`;