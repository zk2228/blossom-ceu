/* ============================================
   Blossom CEU – Client-Side Certificate Generator
   With Code Word Quiz Verification
   ============================================ */

// =============================================
// CODE WORDS PER EPISODE
// To update: just edit the arrays below.
// Words are matched case-insensitively.
// =============================================
const EPISODE_CODE_WORDS = {
    "Episode 01": [],
    "Episode 02": [],
    "Episode 03": ["ice cream", "cupcake", "kale"],
    "Episode 04": ["child-led", "glp", "collaborate"],
    "Episode 05": ["moving", "dentist", "plane ride"],
    "Episode 06": ["mirna", "jenny", "taylor"],
    "Episode 08": ["mirna", "jenny", "taylor"],
    "Episode 09": ["feedback", "time management", "goals"],
    "Episode 10": ["student", "supervisor", "change"],
    "Episode 11": ["collaboration", "implementation", "consistency"],
    "Episode 12": ["rapport", "intake", "goals"],
    "Episode 13": ["hair twirling", "nail biting", "tapping"],
    "Episode 14": ["sleep", "wake window", "night waking"],
    "Episode 16": ["student", "feedback", "skills"],
    "Episode 17": ["request", "mo", "model"],
    "Episode 18": ["aac", "myth", "learner"],
};

// Kosai Zaya's signature (base64-encoded PNG)
const KOSAI_SIGNATURE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAC9AbUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7LooooAKKKKACiis/xBrej+H9Lk1TXdVstLsY/v3F3OsUak9BuYgZPpQBoUV8++L/ANrH4fWN5/Zfg+x1fxpqrnbFDp1uyRs3pvYbj9VRhWGmtfta/EFxcaHo2hfDjT+WiOoqrzMP7rh0kbP/AGySgD6eor50+E/xk8baJ8SY/hV8brC2s9busf2Vq1ugWC9JzgHHykseFKgc/KVBr6LoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK8x/aC+MOifCfw2s86rf69egppmmI3zzP03NjkRg9T36DmgDW+MfxR8KfC3w02seJLz97ICLOxiIM9047IvYdMseB9SAfB/CHw78bftCeIbbx78YBPpXhCJvM0fw3E7R+ah6M3QhSMZc4d+21dtbnwS+CWr+IdfT4r/G531bxLckTWWlXA/c2CdUDJ03DPEfRepyx+X6UoAwvB/g3wp4Ps/snhfw9pmkREYb7LbqjP/vMBlj7kmt2iigDwf8Abh8HW/iH4K3fiCGPbrHhuRb6zuEyJETcolUEcgbfm+qLXpvwf8TN4x+F3hvxPIVM2oadFLPt6CbbiQD6OGFVvjuqt8EPHe5QQPDeoHBGeRbSEVx37E5Lfsx+ESxJOLwc/wDX7PQB7LRRRQAUUUU1nU9P0bSrrVdVvIbKxtImlnnmcKkaAZJJNAFuvJPiZ+0X8KvAbNb3uvjV79G2tZaQFuZEI67juCKR6MwPtXlOv+OviD+0brdz4T+Fn2nw54Fhcxan4hmQo9yO6L0IBHSMEMQRvKg4r2X4UfAz4c/Dm3tZNI0G3u9WgUZ1W9QS3LP3ZSeI/wDgAHHrQB1vw88WaX458Gab4s0ZLqOw1GMyQrdReXKAGKncuT3U8gkEcgkGt+iigAooooAKKKKACiiigAooooAKKKKACiuG+L3xV8G/C7RBqHijUQk8ik2tjDh7m5I/uJnp6scKPXpXiOl+I/2pPixnX/BqaL8PvDzjNiupxK8lyh6Md8MjHjncERSOmaAPqeivnH4I... [content truncated for brevity — full file content passed below]