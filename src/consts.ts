export const SIGVERIFY_PROGRAM_KECCAK_256 = `
program offchain_verifier_keccak.aleo;

struct Credentials:
    issuer as address;
    subject as address;
    dob as u32;
    nationality as field;
    expiry as u32;

closure signature_verification:
    input r0 as field;
    input r1 as signature;
    input r2 as address;
    sign.verify r1 r2 r0 into r3;
    output r3 as boolean;

function verify:
    input r0 as signature.private;
    input r1 as Credentials.private;
    hash.keccak256 r1 into r2 as field;
    call signature_verification r2 r0 r1.issuer into r3;
    output r3 as boolean.private;

`;

export const SIGVERIFY_PROGRAM_SHA3_256 = `
program offchain_verifier_sha3.aleo;

struct Credentials:
    issuer as address;
    subject as address;
    dob as u32;
    nationality as field;
    expiry as u32;

closure signature_verification:
    input r0 as field;
    input r1 as signature;
    input r2 as address;
    sign.verify r1 r2 r0 into r3;
    output r3 as boolean;

function verify:
    input r0 as signature.private;
    input r1 as Credentials.private;
    hash.sha3_256 r1 into r2 as field;
    call signature_verification r2 r0 r1.issuer into r3;
    output r3 as boolean.private;
`;

export const SIGVERIFY_PROGRAM = `
program offchain_verifier.aleo;

struct Credentials:
    issuer as address;
    subject as address;
    dob as u32;
    nationality as field;
    expiry as u32;

closure get_hash:
    input r0 as u8;
    input r1 as Credentials;
    is.eq r0 1u8 into r2;
    hash.bhp1024 r1 into r3 as field;
    hash.psd2 r1 into r4 as field;
    ternary r2 r3 r4 into r5;
    output r5 as field;

closure signature_verification:
    input r0 as field;
    input r1 as signature;
    input r2 as address;
    sign.verify r1 r2 r0 into r3;
    output r3 as boolean;

function verify:
    input r0 as signature.private;
    input r1 as u8.private;
    input r2 as Credentials.private;
    call get_hash r1 r2 into r3;
    call signature_verification r3 r0 r2.issuer into r4;
    output r4 as boolean.private;
`;

export const AGEVERIFY_PROGRAM = `
program age_verification.aleo;

struct date_time:
    seconds as u8;
    minutes as u8;
    hours as u8;
    day as u8;
    month as u32;
    year as u32;

struct Credentials:
    issuer as address;
    subject as address;
    dob as u32;
    nationality as field;
    expiry as u32;


closure timestamp_to_datetime:
    input r0 as u32;
    rem r0 60u32 into r1;
    div r0 60u32 into r2;
    rem r2 60u32 into r3;
    div r2 60u32 into r4;
    rem r4 24u32 into r5;
    div r4 24u32 into r6;
    mul 4u32 r6 into r7;
    add r7 102032u32 into r8;
    div r8 146097u32 into r9;
    add r9 15u32 into r10;
    add r6 2442113u32 into r11;
    add r11 r10 into r12;
    div r10 4u32 into r13;
    sub r12 r13 into r14;
    mul 20u32 r14 into r15;
    sub r15 2442u32 into r16;
    div r16 7305u32 into r17;
    mul 365u32 r17 into r18;
    sub r14 r18 into r19;
    div r17 4u32 into r20;
    sub r19 r20 into r21;
    mul r21 1000u32 into r22;
    div r22 30601u32 into r23;
    mul r23 30u32 into r24;
    sub r21 r24 into r25;
    mul r23 601u32 into r26;
    div r26 1000u32 into r27;
    sub r25 r27 into r28;
    gt r23 13u32 into r29;
    ternary r29 4715u32 4716u32 into r30;
    ternary r29 13u32 1u32 into r31;
    sub r17 r30 into r32;
    sub r23 r31 into r33;
    cast r1 into r34 as u8;
    cast r3 into r35 as u8;
    cast r5 into r36 as u8;
    cast r28 into r37 as u8;
    cast r33 into r38 as u32;
    cast r32 into r39 as u32;
    cast r34 r35 r36 r37 r38 r39 into r40 as date_time;
    output r40 as date_time;

closure get_hash:
    input r0 as u8;
    input r1 as Credentials;
    is.eq r0 1u8 into r2;
    hash.bhp1024 r1 into r3 as field;
    hash.psd2 r1 into r4 as field;
    ternary r2 r3 r4 into r5;
    output r5 as field;


closure signature_verification:
    input r0 as field;
    input r1 as signature;
    input r2 as address;
    sign.verify r1 r2 r0 into r3;
    output r3 as boolean;


function verify:
    input r0 as signature.private;
    input r1 as u8.private;
    input r2 as u32.private;
    input r3 as Credentials.private;
    call timestamp_to_datetime r3.dob into r4;
    call timestamp_to_datetime r2 into r5;
    sub r5.year r4.year into r6;
    gte r6 18u32 into r7;
    call get_hash r1 r3 into r8;
    call signature_verification r8 r0 r3.issuer into r9;
    and r7 r9 into r10;
    output r10 as boolean.private;


closure datetime_to_timestamp:
    input r0 as date_time;
    cast r0.year into r1 as u32;
    cast r0.month into r2 as u32;
    cast r0.day into r3 as u32;
    lte r2 2u32 into r4;
    add r2 12u32 into r5;
    sub r1 1u32 into r6;
    ternary r4 r5 r2 into r7;
    ternary r4 r6 r1 into r8;
    mul 365u32 r8 into r9;
    div r8 4u32 into r10;
    add r9 r10 into r11;
    div r8 100u32 into r12;
    sub r11 r12 into r13;
    div r8 400u32 into r14;
    add r13 r14 into r15;
    mul 30u32 r7 into r16;
    add r7 1u32 into r17;
    mul 3u32 r17 into r18;
    div r18 5u32 into r19;
    add r16 r19 into r20;
    add r20 r3 into r21;
    add r15 r21 into r22;
    sub r22 719561u32 into r23;
    mul r23 86400u32 into r24;
    cast r0.hours into r25 as u32;
    mul 3600u32 r25 into r26;
    cast r0.minutes into r27 as u32;
    mul 60u32 r27 into r28;
    add r26 r28 into r29;
    cast r0.seconds into r30 as u32;
    add r29 r30 into r31;
    add r24 r31 into r32;
    output r32 as u32;
`;